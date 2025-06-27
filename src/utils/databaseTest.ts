
import { supabase } from '@/integrations/supabase/client';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('dados_cliente')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('Database connection successful:', data);
    return true;
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
};

// Run the test immediately
testDatabaseConnection();
