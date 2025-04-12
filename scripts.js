const supabaseClient = supabase.createClient(
    'https://fythreaksbhloxxtwwyi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dGhyZWFrc2JobG94eHR3d3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODI3OTYsImV4cCI6MjA1OTk1ODc5Nn0.Bymrd0FkSFWFS6jjeLVFMRBnftnB7sNL6phmAw8RMTs'
  );
  
  // Only run if form and fields exist on the page
  const form = document.getElementById('review-form');
  const nameInput = document.getElementById('name');
  const reviewInput = document.getElementById('review');
  const reviewContainer = document.querySelector('.reviews-container');
  
  if (form && nameInput && reviewInput && reviewContainer) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const name = nameInput.value.trim();
      const message = document.getElementById('message').value.trim();
  
      if (!name || !message) {
        alert('Please fill out both fields.');
        return;
      }
  
      const { error } = await supabaseClient.from('reviews').insert([{ name, message }]);
  
      if (error) {
        console.error('Error saving review:', error.message);
        alert('There was a problem saving your review. Please try again.');
        return;
      }
  
      form.reset();
      loadReviews();
    });
  
    async function loadReviews() {
      const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
  
      reviewContainer.innerHTML = '';
  
      if (error) {
        console.error('Error fetching reviews:', error.message);
        reviewContainer.innerHTML = '<p>Could not load reviews.</p>';
        return;
      }
  
      if (data.length === 0) {
        reviewContainer.innerHTML = '<p>No reviews yet. Be the first to leave one!</p>';
        return;
      }
  
      data.forEach((review) => {
        const div = document.createElement('div');
        div.className = 'review';
        div.innerHTML = `
          <p><strong>${review.name}</strong> (${new Date(review.created_at).toLocaleDateString()})</p>
          <p>${review.message}</p>
        `;
        reviewContainer.appendChild(div);
      });
    }
  
    document.addEventListener('DOMContentLoaded', loadReviews);
  }
  
