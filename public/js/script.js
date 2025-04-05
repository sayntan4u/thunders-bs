$(document).ready(function () {
    // Check localStorage for sidebar state
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'collapsed') {
        $('#sidebar').addClass('active');
    }

    // Sidebar toggle
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        // Save sidebar state to localStorage
        localStorage.setItem('sidebarState', $('#sidebar').hasClass('active') ? 'collapsed' : 'expanded');
    });

    // Logout Confirmation
    $('#confirmLogout').on('click', function() {
        // Here you would typically make an API call to logout
        window.location.href = '/logout';
    });


    
}); 