const notificationButton = document.getElementById('notification');
if('Notification' in window && 'serviceWorker' in navigator){
    notificationButton.addEventListener('click', () => {
        switch (Notification.permission) {
          case 'denied':
            notificationNotAllowed();
            break;
    
          case 'default':
            requestUserPermission();
            break;
    
          case 'granted':
            configurePushSubscription();
            break;
        }
    
      });
}
else {
    notificationNotAllowed();
}

function notificationNotAllowed() {
    console.log('Notifications not allowed!');
    notificationButton.disabled = true;
}