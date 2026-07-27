import { createSupabaseServer } from "@/lib/supabase/server";
import { getProperties } from "@/services/property";
import FeaturedGuesthouses from "@/components/landing/FeaturedGuestHouse";

export default async function GuestHousePage() {

  const supabase = await createSupabaseServer();
  const {data, error} = await supabase
    .from('master_properties')
    .select('*');   
  if (error) {
    
  }
  
  
  const property = await getProperties();
  

  return (
    <main>
        <div className='bg-white max-w-full h-screen text-black'>
            <FeaturedGuesthouses />
        </div>
    </main>
  )
}