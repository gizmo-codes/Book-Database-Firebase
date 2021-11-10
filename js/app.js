// Code heavily modified from youtube tutorial: https://www.youtube.com/playlist?list=PL4cUxeGkcC9itfjle0ji1xOZ2cjRGY_WB

const courseList = document.querySelector('#course-list');
const courseForm = document.querySelector('#add-course-form');
const bookForm = document.querySelector('#add-book-form');
const editForm = document.querySelector('#edit-book-form');

function renderCourse(doc) {
    // Generate List Element
    let liCourse = document.createElement('li');

    // Course Elements
    let semester = document.createElement('span');
    let courseTitle = document.createElement('span');
    let courseNumber = document.createElement('span');
    let courseLead = document.createElement('span');
    let courseLeadName = document.createElement('span');
    let bookTitle = document.createElement('span');
    let bookISBN = document.createElement('span');
    let notes = document.createElement('span');


    // Cross Elements
    let cross = document.createElement('div');
    cross.textContent = 'X';
    cross.className = 'delete-cross';

    liCourse.setAttribute('data-id', doc.id);
    liCourse.appendChild(cross);

    // Edit Elements
    let edit = document.createElement('div');
    edit.className = 'edit-E';

    liCourse.setAttribute('data-id', doc.id);
    liCourse.appendChild(edit);

	//Create Label Strings
	var semesterWord = "Semester: " + "\t\t\t";
	var courseTitleWord = "Course Title: " + "\t\t";
	var courseNumberWord = "Course Number: " + "\t\t";
	var courseLeadWord = "Course Lead: " + "\t\t";
	var courseLeadNameWord = "Course Lead Name: " + "\t";
	var bookTitleWord = "Book Title: " + "\t\t\t";
	var isbnWord = "Book ISBN: " + "\t\t\t";
    var notesWord = "Notes: " + "\t\t\t\t";

    // Course Getters(?)
    semester.textContent = semesterWord + doc.data().semester;
    courseTitle.textContent = courseTitleWord + doc.data().courseTitle;
    courseNumber.textContent = courseNumberWord + doc.data().courseNumber;
    courseLead.textContent = courseLeadWord + doc.data().courseLead;
    courseLeadName.textContent = courseLeadNameWord + doc.data().courseLeadName;
    bookTitle.textContent = bookTitleWord + doc.data().bookTitle;
    bookISBN.textContent = isbnWord + doc.data().bookISBN;
    notes.textContent = notesWord + doc.data().notes;

    // Append Course Elements
    liCourse.appendChild(semester);
    liCourse.appendChild(courseTitle);
    liCourse.appendChild(courseNumber);
    liCourse.appendChild(courseLead);
    liCourse.appendChild(courseLeadName);
    liCourse.appendChild(bookTitle);
    liCourse.appendChild(bookISBN);
    liCourse.appendChild(notes);

    courseList.appendChild(liCourse);

    // Deleting Data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
		
		document.getElementById('id04').style.display = 'block';
		
		const deleteBook = document.getElementById("confirm-delete-overlay-buttons");
		
		deleteBook.addEventListener("click", (e) => {
			db.collection('Course').doc(id).delete();
			document.getElementById('id04').style.display = 'none';
		})
    });

    // Pull up edit data modal
    edit.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');

        // Start form values as current values for the book selected
        editForm.semester.value = doc.data().semester;
        editForm.courseTitle.value = doc.data().courseTitle;
        editForm.courseNumber.value = doc.data().courseNumber;
        editForm.courseLead.value = doc.data().courseLead;
        editForm.courseLeadName.value = doc.data().courseLeadName;
        editForm.bookTitle.value = doc.data().bookTitle;
        editForm.bookISBN.value = doc.data().bookISBN;
        editForm.notes.value = doc.data().notes;

        document.getElementById('id03').style.display = 'block';

        const editBook = document.getElementById("editBook-overlay-buttons");

        // Edit the data
        editBook.addEventListener("click", (e) => {
            // Add the book based on the inputs
            db.collection('Course').doc(id).set({
                semester: editForm.semester.value,
                courseTitle: editForm.courseTitle.value,
                courseNumber: editForm.courseNumber.value,
                courseLead: editForm.courseLead.value,
                courseLeadName: editForm.courseLeadName.value,
                bookTitle: editForm.bookTitle.value,
                bookISBN: editForm.bookISBN.value,
                notes: editForm.notes.value
            })

            //Delete edited book from courseList


            // Pull the new values
            semester.textContent = semesterWord + editForm.semester.value;
            courseTitle.textContent = courseTitleWord + editForm.courseTitle.value;
            courseNumber.textContent = courseNumberWord + editForm.courseNumber.value;
            courseLead.textContent = courseLeadWord + editForm.courseLead.value;
            courseLeadName.textContent = courseLeadNameWord + editForm.courseLeadName.value;
            bookTitle.textContent = bookTitleWord + editForm.bookTitle.value;
            bookISBN.textContent = isbnWord + editForm.bookISBN.value;
            notes.textContent = notesWord + editForm.notes.value;

            // Attach new values for rendering
            liCourse.appendChild(semester);
            liCourse.appendChild(courseTitle);
            liCourse.appendChild(courseNumber);
            liCourse.appendChild(courseLead);
            liCourse.appendChild(courseLeadName);
            liCourse.appendChild(bookTitle);
            liCourse.appendChild(bookISBN);
            liCourse.appendChild(notes);

            // Close Modal -- Rendering done by Real-Time Listener
            document.getElementById('id03').style.display = 'none';
        })

    });


    //TODO: FIX THE BELOW NOTES

    //--------------------------

    //This is editable through HTML, this should be a check above adding/deleting/editing itself.
    //Leaving this here is fine as well just not completely functional.
    if (firebase.auth().currentUser) {
        cross.style.display = "block"
        edit.style.display = "block"
    }
    else {
        cross.style.display = "none"
        edit.style.display = "none"
    }

}

// Home Page Search
const searchDatabase = document.getElementById("search-button");

searchDatabase.addEventListener("click", (e) => {

    //User input from the serach bar saved as a variable
    var input = document.getElementById("homeSearchInput").value;

    //Lowercase the input to prevent case-sensitive matches.
    input = input.toLowerCase();

    var hit = false;

    //Empty the list to only show hits
    $(courseList).empty();
    e.preventDefault();

    //Match logic
    db.collection('Course').orderBy("courseNumber").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if (doc.data().semester.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().courseTitle.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().courseNumber.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().courseLead.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().courseLeadName.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().bookTitle.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().bookISBN.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
            if (doc.data().notes.toLowerCase() == input) {
                hit = true;
                renderCourse(doc);
            }
        })
        if (input == "") {
            db.collection('Course').orderBy("courseNumber").get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderCourse(doc);
                })
            });
            hit = true;
        }

        if (hit == true) {
            document.getElementById('course-list').style.display = 'block';
            document.getElementById('courseHeaderText').style.display = 'block';
            document.getElementById('courseHeader').style.display = 'block';
        }
        else {
            document.getElementById('course-list').style.display = 'none';
            document.getElementById('courseHeaderText').style.display = 'none';
            document.getElementById('courseHeader').style.display = 'none';

        }
        if (hit == false) {
            console.log("Nothing Found!");

            let liCourse = document.createElement('li');
            let noResults = document.createElement('h3');
            document.getElementsByTagName("h3")[0].setAttribute("class", "spanmod"); 

            noResults.textContent = "No results found!";

            liCourse.appendChild(noResults);
            courseList.appendChild(liCourse);
            document.getElementById('course-list').style.display = 'block';
        }
    });
});

// Advanced Page Search **** WORK IN PROGRESS ****
const advancedSearchDatabase = document.getElementById("advanced-search-button");

advancedSearchDatabase.addEventListener("click", (e) => {

    //User input from the serach bar saved as a variable
    var semesterInput = document.getElementById("advancedSearchSemester").value;
    var courseTitleInput = document.getElementById("advancedSearchCourseTitle").value;
    var courseNumberInput = document.getElementById("advancedSearchCourseNumber").value;
    var courseInstructorInput = document.getElementById("advancedSearchCourseInstructor").value;
    var bookTitleInput = document.getElementById("advancedSearchBookTitle").value;
    var bookISBNInput = document.getElementById("advancedSearchBookISBN").value;
    var bookChosenByInput = document.getElementById("advancedSearchBookChosenBy").value;
    var notesInput = document.getElementById("advancedSearchNotes").value;
    var hit = false;

    //Empty the list to only show hits
    $(courseList).empty();
    e.preventDefault();
	
	db.collection("Course").orderBy("courseNumber").get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			if(doc.data().semester == semesterInput || semesterInput == "") {
				if(doc.data().courseTitle.toLowerCase() == courseTitleInput.toLowerCase() || courseTitleInput == "") {
					if(doc.data().courseNumber == courseNumberInput || courseNumberInput == "") {
						if(doc.data().bookTitle.toLowerCase() == bookTitleInput.toLowerCase() || bookTitleInput == "") {
							if(doc.data().courseLead.toLowerCase() == bookChosenByInput.toLowerCase() || bookChosenByInput == "") {
								if(doc.data().bookISBN.toLowerCase() == bookISBNInput.toLowerCase() || bookISBNInput == "") {
									if(doc.data().courseLeadName.toLowerCase() == courseInstructorInput.toLowerCase() || courseInstructorInput == "") {
										if(doc.data().notes == notesInput.toLowerCase() || notesInput == "") {
											hit = true;
											renderCourse(doc);
										}
									}
								}
							}
						}
					}
				}
			}
		});
		
		 if (hit == false) {
            console.log("Nothing Found!");

            let liCourse = document.createElement('li');
            let noResults = document.createElement('span');

            noResults.textContent = "No results found!";

            liCourse.appendChild(noResults);
            courseList.appendChild(liCourse);
        }
		
		document.getElementById('course-list').style.display = 'block';
		
	});

});


// Saving Data
const addBook = document.getElementById("addBook-overlay-buttons");

addBook.addEventListener("click", (e) => {
    e.preventDefault();
    db.collection('Course').add({
        semester: bookForm.semester.value,
        courseTitle: bookForm.courseTitle.value,
        courseNumber: bookForm.courseNumber.value,
        courseLead: bookForm.courseLead.value,
        courseLeadName: bookForm.courseLeadName.value,
        bookTitle: bookForm.bookTitle.value,
        bookISBN: bookForm.bookISBN.value,
        notes: bookForm.notes.value
    });
    bookForm.semester.value = '';
    bookForm.courseTitle.value = '';
    bookForm.courseNumber.value = '';
    bookForm.courseLead.value = '';
    bookForm.courseLeadName.value = '';
    bookForm.bookTitle.value = '';
    bookForm.bookISBN.value = '';
    bookForm.notes.value = '';
});

// Real Time Listener (Auto Refresh)
db.collection('Course').orderBy('courseNumber').onSnapshot(snapshot => {
    let courseChanges = snapshot.docChanges();
    courseChanges.forEach(change => {
        if (change.type == 'added') {
            renderCourse(change.doc);
        }
        else if (change.type == 'removed') {
            let li = courseList.querySelector('[data-id=' + change.doc.id + ']');
            courseList.removeChild(li);
        }
    });
});

// Authentication //

// Getters
const username = document.getElementById("username");
const password = document.getElementById("password");
const login = document.getElementById("login-overlay-buttons");
const logoutOnNav = document.getElementById("logout");
const loginOnNav = document.getElementById("login");

// Real Time Listener (Login)
login.addEventListener("click", e => {
    e.preventDefault();

    const user = username.value;
    const pass = password.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(user, pass);
    promise.catch(e => console.log(e.message));

    username.value = "";
    password.value = "";
})



// Real Time Listener (Logout)
logoutOnNav.addEventListener("click", e => {
    e.preventDefault();
    firebase.auth().signOut();
    logoutOnNav.style.display = "none";
})

// Displaying Database (Show/Hide Test)
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {

        //Remove Login/Logout buttons when logged in/out
        document.getElementById('login').style.display = 'none'
        document.getElementById('logout').style.display = 'block'
        document.getElementById('addBookNav').style.display = 'block'

        document.getElementById('id01').style.display = 'none'

        var x = document.getElementsByClassName("delete-cross");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "block";
        }

        var e = document.getElementsByClassName("edit-E");
        var i;
        for (i = 0; i < e.length; i++) {
            e[i].style.display = "block";
        }

    }//sean wuz here
    else {
        document.getElementById('login').style.display = 'block'
        document.getElementById('logout').style.display = 'none'
        document.getElementById('addBookNav').style.display = 'none'

        var x = document.getElementsByClassName("delete-cross");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }

        var e = document.getElementsByClassName("edit-E");
        var i;
        for (i = 0; i < e.length; i++) {
            e[i].style.display = "none";
        }

    }
})
