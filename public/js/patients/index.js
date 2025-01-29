const allPatientsTab = document.getElementById('allPatientsTab');
const myPatientsTab = document.getElementById('myPatientsTab');
const allPatientsList = document.getElementById('allPatients');
const myPatientsList = document.getElementById('myPatients');

const urlParams = new URLSearchParams(window.location.search);
const activeTab = urlParams.get('tab') || 'myPatients';

if (allPatientsTab && myPatientsTab && allPatientsList && myPatientsList) {
    if (activeTab === 'allPatients') {
        allPatientsList.style.display = 'flex';
        myPatientsList.style.display = 'none';
        allPatientsTab.classList.add('selected-tab');
        myPatientsTab.classList.remove('selected-tab');
    } else {
        allPatientsList.style.display = 'none';
        myPatientsList.style.display = 'flex';
        myPatientsTab.classList.add('selected-tab');
        allPatientsTab.classList.remove('selected-tab');
    }

    allPatientsTab.addEventListener('click', () => {
        window.location.href = '/patients?tab=allPatients' + (urlParams.has('search') ? '&search=' + urlParams.get('search') : '');
    });

    myPatientsTab.addEventListener('click', () => {
        window.location.href = '/patients?tab=myPatients' + (urlParams.has('search') ? '&search=' + urlParams.get('search') : '');
    });
}
