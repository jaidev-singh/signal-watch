import { supabase } from '../config/supabase';
import seedCreators from '../fixtures/seedCreators.json';

const creatorsService = {
  getCreators: async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('name')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching channels:', error);
        throw error;
      }
      return data ? data.map(c => c.name) : [];
    } catch (error) {
      console.error('Error fetching creators from Supabase:', error);
      return [];
    }
  },

  addCreator: async (creatorName) => {
    try {
      console.log('Adding channel:', creatorName);
      
      // Check if channel already exists
      const { data: existing } = await supabase
        .from('channels')
        .select('name')
        .eq('name', creatorName)
        .single();
      
      if (!existing) {
        const { error } = await supabase
          .from('channels')
          .insert([{ name: creatorName }]);
        
        if (error) {
          console.error('Error inserting channel:', error);
          throw error;
        }
        console.log('Channel added successfully');
      } else {
        console.log('Channel already exists');
      }
      
      return await creatorsService.getCreators();
    } catch (error) {
      console.error('Error adding creator:', error);
      throw error;
    }
  },

  deleteCreator: async (creatorName) => {
    try {
      console.log('Deleting channel:', creatorName);
      
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('name', creatorName);
      
      if (error) throw error;
      
      return await creatorsService.getCreators();
    } catch (error) {
      console.error('Error deleting creator:', error);
      throw error;
    }
  },

  // Helper function to seed initial data (run once)
  seedInitialData: async () => {
    try {
      const { data: existing } = await supabase
        .from('channels')
        .select('id')
        .limit(1);
      
      if (!existing || existing.length === 0) {
        const channelsToInsert = seedCreators.map(name => ({ name }));
        const { error } = await supabase
          .from('channels')
          .insert(creatorsData);
        
        if (error) throw error;
        console.log('Initial creators seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding initial creators:', error);
    }
  }
};

export default creatorsService;
