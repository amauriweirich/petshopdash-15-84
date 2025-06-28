
import { useState, useCallback } from 'react';
import { Appointment, AppointmentFormData } from '@/types/calendar';
import { AppointmentType } from '@/services/calendarApi';
import { useToast } from '@/hooks/use-toast';

export const useAppointments = (appointmentType: AppointmentType) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    petName: '',
    ownerName: '',
    phone: '',
    date: new Date(),
    service: appointmentType === 'VET' ? 'CALL' : 'Banho',
    status: 'pendente' as const,
    notes: ''
  });

  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setFormData({
      petName: '',
      ownerName: '',
      phone: '',
      date: new Date(),
      service: appointmentType === 'VET' ? 'CALL' : 'Banho',
      status: 'pendente',
      notes: ''
    });
  }, [appointmentType]);

  const handleAddAppointment = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm]);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      petName: appointment.petName,
      ownerName: appointment.ownerName,
      phone: appointment.phone,
      date: appointment.date,
      service: appointment.service,
      status: appointment.status,
      notes: appointment.notes
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleDeleteAppointment = useCallback((appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditDialogOpen && currentAppointment) {
      // Update existing appointment
      const updatedAppointment = {
        ...currentAppointment,
        ...formData
      };
      setAppointments(prev => 
        prev.map(apt => apt.id === currentAppointment.id ? updatedAppointment : apt)
      );
      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });
      setIsEditDialogOpen(false);
    } else {
      // Create new appointment
      const newAppointment: Appointment = {
        id: Date.now(),
        ...formData
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast({
        title: "Agendamento criado",
        description: "O novo agendamento foi criado com sucesso.",
      });
      setIsAddDialogOpen(false);
    }
    
    resetForm();
    setCurrentAppointment(null);
  }, [isEditDialogOpen, currentAppointment, formData, resetForm, toast]);

  const confirmDelete = useCallback(() => {
    if (currentAppointment) {
      setAppointments(prev => prev.filter(apt => apt.id !== currentAppointment.id));
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setCurrentAppointment(null);
    }
  }, [currentAppointment, toast]);

  return {
    appointments,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentAppointment,
    formData,
    setFormData,
    handleAddAppointment,
    handleEditAppointment,
    handleDeleteAppointment,
    handleSubmit,
    confirmDelete
  };
};
