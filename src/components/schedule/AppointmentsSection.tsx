import React from 'react';
import { format, isValid } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Appointment, AppointmentFormData } from '@/types/calendar';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Trash2, Edit, Calendar, User, Phone } from 'lucide-react';
import { AppointmentType } from '@/services/calendarApi';
import { useAppointments } from '@/hooks/useAppointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AppointmentsSectionProps {
  appointmentType: AppointmentType;
}

export function AppointmentsSection({ appointmentType }: AppointmentsSectionProps) {
  const {
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
  } = useAppointments(appointmentType);

  // Helper function to safely format dates
  const safeFormatDate = (date: Date | null | undefined, formatString: string): string => {
    if (!date || !isValid(date)) {
      return 'Invalid date';
    }
    return format(date, formatString, { locale: pt });
  };

  const getServiceOptions = () => {
    if (appointmentType === 'VET') {
      return [
        'CALL',
        'Vacinação',
        'Exames de Rotina'
      ];
    } else {
      return [
        'Banho e Tosa',
        'Banho',
        'Tosa'
      ];
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {appointmentType === 'VET' ? 'Agendamentos de CALL' : 'Agendamentos de Banho'}
        </h2>
        <Button onClick={handleAddAppointment}>
          Novo Agendamento
        </Button>
      </div>

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                Nenhum agendamento encontrado para {appointmentType === 'VET' ? 'CALL' : 'Banho'}
              </p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {appointment.ownerName}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteAppointment(appointment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{appointment.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{safeFormatDate(appointment.date, "dd/MM/yyyy 'às' HH:mm")}</span>
                  </div>
                  <div>
                    <strong>Serviço:</strong> {appointment.service}
                  </div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'confirmado' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'cancelado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <strong>Observações:</strong> {appointment.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              Preencha os dados para criar um novo agendamento.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Nome do Cliente</Label>
                <Input 
                  id="ownerName" 
                  value={formData.ownerName} 
                  onChange={e => setFormData({...formData, ownerName: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Data e Hora</Label>
                <Input 
                  id="date" 
                  type="datetime-local" 
                  value={isValid(formData.date) ? format(formData.date, "yyyy-MM-dd'T'HH:mm") : ''} 
                  onChange={e => {
                    const newDate = e.target.value ? new Date(e.target.value) : new Date();
                    setFormData({...formData, date: newDate});
                  }} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Serviço</Label>
                <select 
                  id="service" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                  value={formData.service} 
                  onChange={e => setFormData({...formData, service: e.target.value})} 
                  required
                >
                  {getServiceOptions().map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as 'confirmado' | 'pendente' | 'cancelado'})} 
                  required
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input 
                id="notes" 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Agendamento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
            <DialogDescription>
              Atualize os dados do agendamento.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ownerName">Nome do Cliente</Label>
                <Input 
                  id="edit-ownerName" 
                  value={formData.ownerName} 
                  onChange={e => setFormData({...formData, ownerName: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input 
                  id="edit-phone" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-date">Data e Hora</Label>
                <Input 
                  id="edit-date" 
                  type="datetime-local" 
                  value={isValid(formData.date) ? format(formData.date, "yyyy-MM-dd'T'HH:mm") : ''} 
                  onChange={e => {
                    const newDate = e.target.value ? new Date(e.target.value) : new Date();
                    setFormData({...formData, date: newDate});
                  }} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-service">Serviço</Label>
                <select 
                  id="edit-service" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                  value={formData.service} 
                  onChange={e => setFormData({...formData, service: e.target.value})} 
                  required
                >
                  {getServiceOptions().map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select 
                  id="edit-status" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as 'confirmado' | 'pendente' | 'cancelado'})} 
                  required
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações</Label>
              <Input 
                id="edit-notes" 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Atualizar Agendamento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {currentAppointment && (
            <div className="py-4">
              <p><strong>Cliente:</strong> {currentAppointment.ownerName}</p>
              <p><strong>Data/Hora:</strong> {safeFormatDate(currentAppointment.date, "dd/MM/yyyy 'às' HH:mm")}</p>
              <p><strong>Serviço:</strong> {currentAppointment.service}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
