
import React, { useState } from 'react';
import CalendarSidebar from '../components/schedule/CalendarSidebar';
import { AppointmentsSection } from '../components/schedule/AppointmentsSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';
import { AppointmentType } from '../services/calendarApi';

const Schedule = () => {
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('VET');
  const [tabNames, setTabNames] = useState({
    vet: 'Veterinário',
    banho: 'Banho'
  });
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const handleEditTab = (tabKey: string) => {
    setEditingTab(tabKey);
    setTempName(tabNames[tabKey as keyof typeof tabNames]);
  };

  const handleSaveName = (tabKey: string) => {
    if (tempName.trim()) {
      setTabNames(prev => ({
        ...prev,
        [tabKey]: tempName.trim()
      }));
    }
    setEditingTab(null);
    setTempName('');
  };

  const handleCancelEdit = () => {
    setEditingTab(null);
    setTempName('');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <Tabs defaultValue="vet" onValueChange={(value) => setAppointmentType(value === 'vet' ? 'VET' : 'BANHO')}>
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="vet" className="flex items-center gap-2">
                {editingTab === 'vet' ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="h-6 text-xs w-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName('vet');
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <Button size="xs" onClick={() => handleSaveName('vet')}>✓</Button>
                    <Button size="xs" variant="outline" onClick={handleCancelEdit}>✕</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {tabNames.vet}
                    <Button 
                      size="xs" 
                      variant="ghost" 
                      onClick={() => handleEditTab('vet')}
                      className="h-4 w-4 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </TabsTrigger>
              <TabsTrigger value="banho" className="flex items-center gap-2">
                {editingTab === 'banho' ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="h-6 text-xs w-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveName('banho');
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <Button size="xs" onClick={() => handleSaveName('banho')}>✓</Button>
                    <Button size="xs" variant="outline" onClick={handleCancelEdit}>✕</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {tabNames.banho}
                    <Button 
                      size="xs" 
                      variant="ghost" 
                      onClick={() => handleEditTab('banho')}
                      className="h-4 w-4 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <CalendarSidebar appointmentType={appointmentType} />
          <AppointmentsSection appointmentType={appointmentType} />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
