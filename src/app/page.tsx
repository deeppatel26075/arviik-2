import { productService } from '@/services/productService';
import { supabase } from '@/lib/supabase';
import HomeClientWrapper from './HomeClientWrapper';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const displayProducts = await productService.getAllProducts();

  let dbSettings: any[] = [];
  try {
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*');
    if (settingsData) {
      dbSettings = settingsData;
    }
  } catch (err) {
    console.error('Error loading Supabase settings data:', err);
  }

  // Convert array of settings to key-value map
  const settingsMap = dbSettings.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return (
    <div className="space-y-0">
      {/* Client-side animations wrapper */}
      <HomeClientWrapper products={displayProducts as any} settings={settingsMap} />
    </div>
  );
}
