const mediaQuery = window.matchMedia('(max-width: 915px)');
const child = document.getElementById('child');
const target = document.getElementById('target');
const parentA = document.getElementById('container-a');

function handleTabletChange(e) {
    if (e.matches) {

        target.appendChild(child);
    } else {

        parentA.appendChild(child);
    }
}


mediaQuery.addEventListener('change', handleTabletChange);

handleTabletChange(mediaQuery);