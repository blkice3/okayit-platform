
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Award, 
  CheckCircle2, 
  Play,
  RefreshCw,
  Target,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { locationData } from '@/lib/location-data';
import { LocationName } from '@/lib/types';
import VoiceInputButton from '@/components/voice-input-button';

interface LocationModuleProps {
  locationId: LocationName;
  onBack: () => void;
  onComplete: (locationId: string, score: number, timeSpent: number, answers: any) => void;
  userProgress?: any;
}

export default function LocationModule({ 
  locationId, 
  onBack, 
  onComplete,
  userProgress 
}: LocationModuleProps) {
  const location = locationData[locationId];
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityAnswers, setActivityAnswers] = useState<any>({});
  const [totalScore, setTotalScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentActivity = location?.activities?.[currentActivityIndex];
  const progress = ((currentActivityIndex + 1) / (location?.activities?.length || 1)) * 100;

  useEffect(() => {
    if (userProgress?.completed) {
      setIsCompleted(true);
      setShowResults(true);
    }
  }, [userProgress]);

  const handleAnswer = (activityId: string, answer: any) => {
    setActivityAnswers((prev: any) => ({
      ...prev,
      [activityId]: answer
    }));
  };

  const handleActivityComplete = (activityScore: number) => {
    setTotalScore((prev: number) => prev + activityScore);
    
    if (currentActivityIndex < location.activities.length - 1) {
      setCurrentActivityIndex((prev: number) => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      onComplete(locationId, totalScore + activityScore, timeSpent, activityAnswers);
      setIsCompleted(true);
      setShowResults(true);
    }
  };

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Location not found</p>
            <Button onClick={onBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${location.bgGradient} p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to House
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {location.title}
            </h1>
            <p className="text-white/90">
              {location.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5" />
            <span className="font-semibold">{totalScore} pts</span>
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <Card className="bg-white/20 backdrop-blur-sm border-0 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Activity {currentActivityIndex + 1} of {location.activities.length}
                </span>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {Math.round(progress)}% Complete
                </Badge>
              </div>
              <Progress value={progress} className="bg-white/20" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Content */}
        <AnimatePresence mode="wait">
          {!showResults ? (
            <ActivityRenderer
              key={currentActivity?.id}
              activity={currentActivity}
              location={location}
              onComplete={handleActivityComplete}
              onAnswer={handleAnswer}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          ) : (
            <ResultsView
              key="results"
              location={location}
              totalScore={totalScore}
              timeSpent={Math.floor((Date.now() - startTime) / 1000)}
              activityAnswers={activityAnswers}
              onRestart={() => {
                setCurrentActivityIndex(0);
                setActivityAnswers({});
                setTotalScore(0);
                setCurrentQuestionIndex(0);
                setShowResults(false);
                setIsCompleted(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActivityRenderer({ 
  activity, 
  location, 
  onComplete, 
  onAnswer,
  currentQuestionIndex,
  setCurrentQuestionIndex 
}: any) {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activityScore, setActivityScore] = useState(0);
  const [gameState, setGameState] = useState<any>({});
  const [reflectionText, setReflectionText] = useState('');

  if (!activity) return null;

  const handleQuizSubmit = () => {
    if (activity.type === 'quiz') {
      const questions = activity.content.questions;
      const currentQ = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQ.correctAnswer;
      const points = isCorrect ? currentQ.points : 0;
      
      setActivityScore((prev: number) => prev + points);
      setShowExplanation(true);
      
      onAnswer(activity.id, {
        questionIndex: currentQuestionIndex,
        answer: selectedAnswer,
        correct: isCorrect,
        points
      });
    }
  };

  const handleQuizNext = () => {
    if (currentQuestionIndex < activity.content.questions.length - 1) {
      setCurrentQuestionIndex((prev: number) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onComplete(activityScore);
    }
  };

  const handleScenarioSubmit = () => {
    const isCorrect = selectedAnswer === activity.content.correctAnswer;
    const points = isCorrect ? activity.points : Math.floor(activity.points * 0.5);
    onAnswer(activity.id, { answer: selectedAnswer, correct: isCorrect, points });
    onComplete(points);
  };

  const handleGameComplete = () => {
    const completedTasks = gameState.completedTasks || 0;
    const totalTasks = activity.content.tasks?.length || 0;
    const points = Math.floor((completedTasks / totalTasks) * activity.points);
    onComplete(points);
  };

  const handleReflectionComplete = () => {
    onAnswer(activity.id, { reflection: reflectionText });
    onComplete(activity.points); // Full points for completing reflection
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gray-800">
              {activity.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50">
                <Award className="w-3 h-3 mr-1" />
                {activity.points} pts
              </Badge>
            </div>
          </div>
          <p className="text-gray-900">{activity.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quiz Activity */}
          {activity.type === 'quiz' && (
            <div className="space-y-6">
              {activity.content.questions && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">
                      Question {currentQuestionIndex + 1} of {activity.content.questions.length}
                    </h3>
                    <Badge variant="secondary">
                      {activity.content.questions[currentQuestionIndex]?.points} points
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="font-medium text-gray-800 mb-4">
                      {activity.content.questions[currentQuestionIndex]?.question}
                    </p>
                    
                    {activity.content.questions[currentQuestionIndex]?.type === 'multiple-choice' && (
                      <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                        {activity.content.questions[currentQuestionIndex]?.options?.map((option: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-white">
                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {activity.content.questions[currentQuestionIndex]?.type === 'true-false' && (
                      <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(value === 'true')}>
                        <div className="flex items-center space-x-2 p-2 rounded hover:bg-white">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true" className="cursor-pointer">True</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-2 rounded hover:bg-white">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false" className="cursor-pointer">False</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                  
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-4 ${
                        selectedAnswer === activity.content.questions[currentQuestionIndex]?.correctAnswer
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className={`w-5 h-5 mt-0.5 ${
                          selectedAnswer === activity.content.questions[currentQuestionIndex]?.correctAnswer
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            selectedAnswer === activity.content.questions[currentQuestionIndex]?.correctAnswer
                              ? 'text-green-800'
                              : 'text-red-800'
                          }`}>
                            {selectedAnswer === activity.content.questions[currentQuestionIndex]?.correctAnswer
                              ? 'Correct!'
                              : 'Not quite right'}
                          </p>
                          <p className="text-gray-900 mt-1">
                            {activity.content.questions[currentQuestionIndex]?.explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="flex gap-3">
                    {!showExplanation ? (
                      <Button 
                        onClick={handleQuizSubmit}
                        disabled={selectedAnswer === null}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleQuizNext}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {currentQuestionIndex < activity.content.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scenario Activity */}
          {activity.type === 'scenario' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Scenario
                </h3>
                <p className="text-blue-700 mb-4">{activity.content.scenario}</p>
                <p className="font-medium text-blue-800">{activity.content.question}</p>
              </div>
              
              <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
                {activity.content.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`scenario-${index}`} />
                    <Label htmlFor={`scenario-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <Button 
                onClick={handleScenarioSubmit}
                disabled={selectedAnswer === null}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Submit Response
              </Button>
            </div>
          )}

          {/* Game Activity */}
          {activity.type === 'game' && activity.content.gameType === 'checklist' && (
            <div className="space-y-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Complete all tasks to earn points!
                </h3>
                <div className="space-y-3">
                  {activity.content.tasks?.map((task: any, index: number) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                      <input
                        type="checkbox"
                        checked={gameState[task.id] || false}
                        onChange={(e) => {
                          setGameState((prev: any) => ({
                            ...prev,
                            [task.id]: e.target.checked,
                            completedTasks: Object.values({...prev, [task.id]: e.target.checked}).filter(Boolean).length
                          }));
                        }}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className={`flex-1 ${gameState[task.id] ? 'line-through text-gray-900' : 'text-gray-800'}`}>
                        {task.task}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {task.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={handleGameComplete}
                disabled={!gameState.completedTasks}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Complete Activity ({gameState.completedTasks || 0}/{activity.content.tasks?.length || 0} tasks)
              </Button>
            </div>
          )}

          {/* Video Activity */}
          {activity.type === 'video' && (
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Play className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-purple-800">Video Content</h3>
                    <p className="text-purple-600 text-sm">Duration: {activity.content.duration}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg aspect-video flex items-center justify-center mb-4">
                  <Button 
                    onClick={() => onComplete(activity.points)}
                    size="lg"
                    className="bg-white text-gray-800 hover:bg-gray-100"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Play Video
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-800">Key Learning Points:</h4>
                  <ul className="space-y-1">
                    {activity.content.keyPoints?.map((point: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-purple-700">
                        <CheckCircle2 className="w-4 h-4" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Reflection Activity */}
          {activity.type === 'reflection' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Reflection Time
                </h3>
                <p className="text-yellow-700 mb-4">{activity.content.guidance}</p>
                
                <div className="space-y-4">
                  {activity.content.prompts?.map((prompt: string, index: number) => (
                    <div key={index} className="bg-white p-4 rounded border">
                      <p className="font-medium text-gray-800 mb-2">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="reflection" className="text-sm font-medium flex items-center gap-2">
                  Share your thoughts (optional):
                  <VoiceInputButton onTranscript={(t) => setReflectionText(prev => prev ? prev + ' ' + t : t)} color="blue" />
                </Label>
                <Textarea
                  id="reflection"
                  placeholder="Write your reflections here... (or tap 🎤 to speak)"
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleReflectionComplete}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Complete Reflection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ResultsView({ 
  location, 
  totalScore, 
  timeSpent, 
  activityAnswers, 
  onRestart 
}: any) {
  const maxPossibleScore = location.activities.reduce((sum: number, activity: any) => sum + activity.points, 0);
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Results Header */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Location Completed!
          </h2>
          <p className="text-gray-900 mb-6">
            Great job exploring {location.title}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{totalScore}</p>
              <p className="text-sm text-blue-700">Points Earned</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{percentage}%</p>
              <p className="text-sm text-green-700">Score Percentage</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{minutes}:{seconds.toString().padStart(2, '0')}</p>
              <p className="text-sm text-purple-700">Time Spent</p>
            </div>
          </div>
          
          <Progress value={percentage} className="mb-4" />
          <p className="text-sm text-gray-900">
            You scored {totalScore} out of {maxPossibleScore} possible points
          </p>
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Learning Outcomes Achieved
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {location.learningOutcomes?.map((outcome: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-800">{outcome}</span>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={onRestart}
          variant="outline"
          className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </motion.div>
  );
}
