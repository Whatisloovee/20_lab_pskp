document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const deleteBtn = document.getElementById('deleteBtn');
  
    if (nameInput && phoneInput && deleteBtn) {
      const originalName = nameInput.value;
      const originalPhone = phoneInput.value;
  
      function checkChanges() {
        const nameChanged = nameInput.value !== originalName;
        const phoneChanged = phoneInput.value !== originalPhone;
        deleteBtn.disabled = nameChanged || phoneChanged;
      }
  
      nameInput.addEventListener('input', checkChanges);
      phoneInput.addEventListener('input', checkChanges);
    }
  
    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/delete';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'id';
        input.value = document.querySelector('input[name="id"]').value;
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      });
    }
  });