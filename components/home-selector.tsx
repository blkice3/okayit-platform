
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HOME_CONTEXTS, HomeContext } from '@/lib/home-contexts';

interface HomeSelectorProps {
  currentHome: HomeContext;
  onHomeChange: (homeId: string) => void;
}

export default function HomeSelector({ currentHome, onHomeChange }: HomeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm">
          <div className={`w-8 h-8 bg-gradient-to-r ${currentHome.theme.gradient} rounded-lg flex items-center justify-center`}>
            <Home className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-slate-900">{currentHome.name}</div>
            <div className="text-xs text-slate-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {currentHome.location}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-700" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-3 bg-white border border-gray-200 shadow-md">
        <div className="mb-3 px-1">
          <h3 className="font-bold text-slate-900 mb-1">Select Care Home</h3>
          <p className="text-sm text-slate-600">Switch between different care home experiences</p>
        </div>
        
        {HOME_CONTEXTS.map((home) => (
          <DropdownMenuItem
            key={home.id}
            className="p-3 cursor-pointer hover:bg-indigo-50 rounded-lg focus:bg-indigo-50"
            onClick={() => onHomeChange(home.id)}
          >
            <Card className="w-full border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${home.theme.gradient} rounded-xl flex items-center justify-center shadow-md`}>
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{home.fullName}</span>
                      {currentHome.id === home.id && (
                        <Badge className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">{home.description}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3 h-3" />
                      {home.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
