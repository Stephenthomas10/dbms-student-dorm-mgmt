document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    fetch('/register_student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('registerResponse').innerText = data;
        this.reset();
        loadRoomAvailability(); // Reload availability after registration
    });
});

document.getElementById('assignForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    fetch('/assign_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('assignResponse').innerText = data;
        this.reset();
    });
});

document.getElementById('checkAvailability').addEventListener('click', function() {
    loadRoomAvailability();
});

function loadRoomAvailability() {
    fetch('/check_availability')
    .then(response => response.json())
    .then(data => {
        const availabilityDiv = document.getElementById('availability');
        availabilityDiv.innerHTML = '<h3 class="font-semibold mb-2">Room Availability:</h3>';
        data.forEach(room => {
            availabilityDiv.innerHTML += `<p>Room ID: ${room.room_id}, Number: ${room.room_number}, Available: ${room.availability ? 'Yes' : 'No'}</p>`;
        });
    });
}

document.getElementById('addRoomForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    fetch('/add_room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('addRoomResponse').innerText = data;
        this.reset();
        loadRoomAvailability(); // Reload availability after adding a room
    });
});
