
// Digital Certificate Signing System for Care Home Experience Platform

import { offlineStorage } from './offline-storage';

export interface CertificateData {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  experienceType: 'welcome-guide' | 'house-tour' | 'family-activities' | 'story-experience' | 'full-platform';
  completionDate: Date;
  achievements: string[];
  progressData: {
    sectionsCompleted: number;
    totalSections: number;
    timeSpent: number; // in minutes
    interactionsCompleted: string[];
  };
  homeContext: {
    name: string;
    location: string;
  };
  certificateLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  verificationHash: string;
  digitalSignature: string;
  issueAuthority: string;
  expiryDate?: Date;
}

export interface UserRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  age?: number;
  userType: 'resident' | 'visitor' | 'family' | 'staff' | 'inspector';
  registrationDate: Date;
  deviceId: string;
  isVerified: boolean;
  preferences: {
    notifications: boolean;
    dataSharing: boolean;
    progressTracking: boolean;
  };
  homeContext: string;
}

class CertificateSigningService {
  private readonly SIGNING_KEY = 'CLAUDIUS_CERT_2024_V2';
  private readonly AUTHORITY = 'Care Experience Window';

  // One-time registration during app installation
  async registerUser(userData: Partial<UserRegistration>): Promise<UserRegistration> {
    const deviceId = await this.getDeviceId();
    const userId = this.generateUserId();

    const registration: UserRegistration = {
      id: userId,
      firstName: userData.firstName || 'Guest',
      lastName: userData.lastName || 'User',
      email: userData.email,
      age: userData.age,
      userType: userData.userType || 'visitor',
      registrationDate: new Date(),
      deviceId,
      isVerified: true,
      preferences: {
        notifications: userData.preferences?.notifications ?? true,
        dataSharing: userData.preferences?.dataSharing ?? false,
        progressTracking: userData.preferences?.progressTracking ?? true
      },
      homeContext: userData.homeContext || 'care-window'
    };

    // Store registration permanently
    await offlineStorage.saveSetting('user_registration', registration);
    await offlineStorage.saveSetting('registration_complete', true);
    
    console.log('User registered successfully:', registration.id);
    return registration;
  }

  // Check if user is already registered
  async isUserRegistered(): Promise<boolean> {
    const isComplete = await offlineStorage.getSetting('registration_complete');
    return !!isComplete;
  }

  // Get current user registration
  async getUserRegistration(): Promise<UserRegistration | null> {
    return await offlineStorage.getSetting('user_registration');
  }

  // Generate signed certificate
  async generateCertificate(
    experienceType: CertificateData['experienceType'],
    progressData: CertificateData['progressData'],
    achievements: string[] = []
  ): Promise<CertificateData> {
    const user = await this.getUserRegistration();
    if (!user) {
      throw new Error('User not registered');
    }

    const certificateId = this.generateCertificateId();
    const completionDate = new Date();
    const level = this.calculateCertificateLevel(progressData, achievements);
    
    const certificateData: Omit<CertificateData, 'verificationHash' | 'digitalSignature'> = {
      id: certificateId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      experienceType,
      completionDate,
      achievements,
      progressData,
      homeContext: {
        name: 'Care Experience Window',
        location: 'Interactive Experience Platform'
      },
      certificateLevel: level,
      issueAuthority: this.AUTHORITY,
      expiryDate: this.calculateExpiryDate(completionDate)
    };

    // Generate verification hash and digital signature
    const verificationHash = await this.generateVerificationHash(certificateData);
    const digitalSignature = await this.generateDigitalSignature(certificateData, verificationHash);

    const signedCertificate: CertificateData = {
      ...certificateData,
      verificationHash,
      digitalSignature
    };

    // Store certificate
    await this.storeCertificate(signedCertificate);
    
    return signedCertificate;
  }

  // Verify certificate authenticity
  async verifyCertificate(certificate: CertificateData): Promise<boolean> {
    try {
      const recalculatedHash = await this.generateVerificationHash(certificate);
      const recalculatedSignature = await this.generateDigitalSignature(
        certificate, 
        recalculatedHash
      );

      return certificate.verificationHash === recalculatedHash &&
             certificate.digitalSignature === recalculatedSignature;
    } catch (error) {
      console.error('Certificate verification failed:', error);
      return false;
    }
  }

  // Get all user certificates
  async getUserCertificates(): Promise<CertificateData[]> {
    const user = await this.getUserRegistration();
    if (!user) return [];

    const certificates = await offlineStorage.getSetting('user_certificates') || [];
    return certificates.filter((cert: CertificateData) => cert.userId === user.id);
  }

  private async getDeviceId(): Promise<string> {
    // Use device fingerprinting for consistent device ID
    try {
      const { DeviceFingerprint } = await import('./device-fingerprint');
      const deviceId = await DeviceFingerprint.getDeviceId();
      return deviceId;
    } catch (error) {
      console.error('Failed to get device fingerprint, falling back to simple ID:', error);
      
      // Fallback to simple device ID
      let deviceId = await offlineStorage.getSetting('device_id');
      
      if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await offlineStorage.saveSetting('device_id', deviceId);
      }
      
      return deviceId;
    }
  }

  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateCertificateId(): string {
    return 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private calculateCertificateLevel(
    progress: CertificateData['progressData'], 
    achievements: string[]
  ): CertificateData['certificateLevel'] {
    const completionPercentage = (progress.sectionsCompleted / progress.totalSections) * 100;
    const achievementScore = achievements.length * 10;
    const timeBonus = Math.min(progress.timeSpent / 60, 2) * 5; // Max 2 hours for bonus
    
    const totalScore = completionPercentage + achievementScore + timeBonus;

    if (totalScore >= 95) return 'platinum';
    if (totalScore >= 85) return 'gold';
    if (totalScore >= 70) return 'silver';
    return 'bronze';
  }

  private calculateExpiryDate(issueDate: Date): Date {
    const expiry = new Date(issueDate);
    expiry.setFullYear(expiry.getFullYear() + 2); // Valid for 2 years
    return expiry;
  }

  private async generateVerificationHash(certificate: Omit<CertificateData, 'verificationHash' | 'digitalSignature'>): Promise<string> {
    const dataString = JSON.stringify({
      id: certificate.id,
      userId: certificate.userId,
      experienceType: certificate.experienceType,
      completionDate: certificate.completionDate.toISOString(),
      progressData: certificate.progressData,
      achievements: certificate.achievements.sort(),
      issueAuthority: certificate.issueAuthority
    });

    // Simple hash generation (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return 'hash_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
  }

  private async generateDigitalSignature(
    certificate: Omit<CertificateData, 'verificationHash' | 'digitalSignature'>,
    verificationHash: string
  ): Promise<string> {
    const signatureData = {
      hash: verificationHash,
      authority: this.AUTHORITY,
      key: this.SIGNING_KEY,
      timestamp: Date.now()
    };

    const signatureString = JSON.stringify(signatureData);
    
    // Simple signature generation (in production, use proper cryptographic signing)
    let signature = 0;
    for (let i = 0; i < signatureString.length; i++) {
      const char = signatureString.charCodeAt(i);
      signature = ((signature << 3) - signature) + char;
      signature = signature & signature;
    }

    return 'sig_' + Math.abs(signature).toString(36) + '_claudius_' + Date.now().toString(36);
  }

  private async storeCertificate(certificate: CertificateData): Promise<void> {
    const certificates = await offlineStorage.getSetting('user_certificates') || [];
    certificates.push(certificate);
    await offlineStorage.saveSetting('user_certificates', certificates);
  }
}

// Export singleton instance
export const certificateService = new CertificateSigningService();
