
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useClientStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalServices: 0,
    newClientsThisMonth: 0,
    monthlyGrowth: [],
    serviceTypes: [],
    recentClients: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch total clients
      const { count: totalClients } = await (supabase as any)
        .from('dados_cliente')
        .select('*', { count: 'exact' });

      // Fetch total services (assuming each client represents a service interaction)
      const { count: totalServices } = await (supabase as any)
        .from('dados_cliente')
        .select('*', { count: 'exact' });

      // Fetch new clients this month
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { count: newClientsThisMonth } = await (supabase as any)
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .gte('created_at', firstDayOfMonth.toISOString())
        .lte('created_at', today.toISOString());

      // Fetch monthly growth data
      const currentYear = new Date().getFullYear();
      const monthlyGrowthData = [];
      
      for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(currentYear, month, 1);
        const endOfMonth = new Date(currentYear, month + 1, 0);
        
        const { count } = await (supabase as any)
          .from('dados_cliente')
          .select('*', { count: 'exact' })
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlyGrowthData.push({
          month: monthNames[month],
          clients: count || 0
        });
      }

      // Mock service types data (you can customize this based on your needs)
      const colors = [
        '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', 
        '#F59E0B', '#EF4444', '#6366F1', '#14B8A6',
        '#F97316', '#8B5CF6', '#06B6D4', '#D946EF'
      ];

      const serviceTypes = [
        { name: 'Consultoria Financeira', value: Math.floor(Math.random() * 50) + 20, color: colors[0] },
        { name: 'Planejamento', value: Math.floor(Math.random() * 40) + 15, color: colors[1] },
        { name: 'Investimentos', value: Math.floor(Math.random() * 35) + 10, color: colors[2] },
        { name: 'Seguros', value: Math.floor(Math.random() * 30) + 8, color: colors[3] },
      ];

      // Fetch recent clients
      const { data: recentClientsData } = await (supabase as any)
        .from('dados_cliente')
        .select('id, nome, telefone, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const recentClients = recentClientsData?.map((client: any) => ({
        id: client.id,
        name: client.nome,
        phone: client.telefone,
        services: 1,
        lastVisit: new Date(client.created_at).toLocaleDateString('pt-BR')
      })) || [];

      setStats({
        totalClients: totalClients || 0,
        totalServices: totalServices || 0,
        newClientsThisMonth: newClientsThisMonth || 0,
        monthlyGrowth: monthlyGrowthData,
        serviceTypes,
        recentClients
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Ocorreu um erro ao atualizar as estatísticas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}
