// Code heavily modified from youtube tutorial: https://www.youtube.com/playlist?list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB

const institutionList = document.querySelector('#institution-list');
const institutionForm = document.querySelector('#add-institution-form');

const courseList = document.querySelector('#course-list');
const courseForm = document.querySelector('#add-course-form');

// Create element and render Institutions.
function renderInstitution(doc)
{
    // Generate List Element
    let liInstitution = document.createElement('li');


    // Institution Elements
    let name = document.createElement('span');
    let location = document.createElement('span');
    let institutionType = document.createElement('span');

    // Cross Elements
    let cross = document.createElement('div');
    cross.textContent = 'x';
    cross.className = 'delete-cross';

    liInstitution.setAttribute('data-id', doc.id);
    liInstitution.appendChild(cross);

    // Institute Getters(?)
    name.textContent = doc.data().name;
    location.textContent = doc.data().location;
    institutionType.textContent = doc.data().institutionType;

    // Append Institution Elements
    liInstitution.appendChild(name);
    liInstitution.appendChild(location);
    liInstitution.appendChild(institutionType);

    institutionList.appendChild(liInstitution);

    // Deleting Data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        
        db.collection('Institution').doc(id).delete();
    });
}



function renderCourse(doc)
{
    // Generate List Element
    let liCourse = document.createElement('li');

    // Course Elements
    let semester = document.createElement('span');
    let courseTitle = document.createElement('span');
    let courseNumber = document.createElement('span');
    let courseInstructor = document.createElement('span');
    let bookTitle = document.createElement('span');
    let bookISBN = document.createElement('span');
    let notes = document.createElement('span');

    
    // Cross Elements
    let cross = document.createElement('div');
    cross.textContent = 'x';
    cross.className = 'delete-cross';

    liCourse.setAttribute('data-id', doc.id);
    liCourse.appendChild(cross);

    // Course Getters(?)
    semester.textContent = doc.data().semester;
    courseTitle.textContent = doc.data().courseTitle;
    courseNumber.textContent = doc.data().courseNumber;
    courseInstructor.textContent = doc.data().courseInstructor;
    bookTitle.textContent = doc.data().bookTitle;
    bookISBN.textContent = doc.data().bookISBN;
    notes.textContent = doc.data().notes;

    // Append Course Elements
    liCourse.appendChild(semester);
    liCourse.appendChild(courseTitle);
    liCourse.appendChild(courseNumber);
    liCourse.appendChild(courseInstructor);
    liCourse.appendChild(bookTitle);
    liCourse.appendChild(bookISBN);
    liCourse.appendChild(notes);

    courseList.appendChild(liCourse);

    // Deleting Data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        
        db.collection('Course').doc(id).delete();

        /* 
        if (e.target.parentElement = 'Institution')
        {
            db.collection('Institution').doc(id).delete();
        }
        else if (e.target.parentElement = 'Course')
        {
            db.collection('Course').doc(id).delete();
        }
        */
    });
}

// Getting Data (Asynchronous)

/*
db.collection('Institution').where('location', '==', 'Newark').get().then((snapshot) =>
db.collection('Institution').orderBy('name').get().then((snapshot) =>

Used for getting specific data and odering it. You can also combine it. 
AN INDEX IS REQUIRED WHEN USING MORE COMLICATED FUNCTIONS, FOLLOW ERROR LINK IN CONSOLE
db.collection('Institution').where('location', '==', 'Newark').orderBy('name').get().then((snapshot) =>

// Old way of displaying (asynchronous)
db.collection('Institution').orderBy('name').get().then((snapshot) =>
{
    snapshot.docs.forEach(doc => {
        renderInstitution(doc);
    });
});
*/

// Saving Data
institutionForm.addEventListener('submit', (e) =>
{
    e.preventDefault();
    db.collection('Institution').add({
        name: institutionForm.name.value,
        location: institutionForm.location.value,
        institutionType: institutionForm.institutionType.value
    });
    institutionForm.name.value = '';
    institutionForm.location.value = '';
    institutionForm.institutionType.value = '';
});

courseForm.addEventListener('submit', (e) =>
{
    e.preventDefault();
    db.collection('Course').add({
        semester: courseForm.semester.value,
        courseTitle: courseForm.courseTitle.value,
        courseNumber: courseForm.courseNumber.value,
        courseInstructor: courseForm.courseInstructor.value,
        bookTitle: courseForm.bookTitle.value,
        bookISBN: courseForm.bookISBN.value,
        notes: courseForm.notes.value
    });
    courseForm.semester.value = '';
    courseForm.courseTitle.value = '';
    courseForm.courseNumber.value = '';
    courseForm.courseInstructor.value = '';
    courseForm.bookTitle.value = '';
    courseForm.bookISBN.value = '';
    courseForm.notes.value = '';
});

// Real Time Listener (Auto Refresh)

db.collection('Course').orderBy('courseTitle').onSnapshot(snapshot => {
    let courseChanges = snapshot.docChanges();
    courseChanges.forEach(change => {
        if(change.type == 'added')
        {
            renderCourse(change.doc);
        }
        else if (change.type == 'removed')
        {
            let li = courseList.querySelector('[data-id=' + change.doc.id + ']');
            courseList.removeChild(li);
        }
    });
});

// Bootleg fix for following error: Uncaught TypeError: Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.
// institutionList is changed to courseList as the two lists are getting merged into courseList for some reason.
// This causes a removeChild error as the node at that point is null for institutionList.

// THIS HAS SINCE BEEN FIXED. Splitting up the render database functions in to sepeate functions fixed everything.

db.collection('Institution').orderBy('name').onSnapshot(snapshot => {
    let institutionChanges = snapshot.docChanges();
    institutionChanges.forEach(change => {
        if(change.type == 'added')
        {
            renderInstitution(change.doc);
        }
        else if (change.type == 'removed')
        {
            let li = institutionList.querySelector('[data-id=' + change.doc.id + ']');
            institutionList.removeChild(li);
        }
    });
});