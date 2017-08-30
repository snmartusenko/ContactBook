/**
 * Created by Serg on 22.08.2017.
 */

// ;(function () {
// "use strict";

let contactBook = {}; //as object

//contactBook load/save functions
let loadContactBook = function () {
    let data = window.localStorage.getItem('contactBook');
    if (data) {
        contactBook = JSON.parse(data);
    }
};

let saveContactBook = function () {
    let data = JSON.stringify(contactBook);
    window.localStorage.setItem('contactBook', data);
};

//main functions
let addContact = function () {

    showInputContactForm();
    showSuccess('Please type: Firstname, Lastname, Phone');

    //clear contact form
    contactFormFirstname.value = '';
    contactFormLastname.value = '';
    contactFormPhone.value = '';
    contactFormEmail.value = '';
};

let editContact = function (id) {
    let oldContact = contactBook['id_' + id];
    showInputContactForm();

    //load contact form
    contactFormID.value = oldContact.id;
    contactFormFirstname.value = oldContact.firstname;
    contactFormLastname.value = oldContact.lastname;
    contactFormPhone.value = oldContact.phones;
    contactFormEmail.value = oldContact.emails;
};

let submitContactForm = function () {

        let emptyContact = {
            'id': 0,
            'firstname': '',
            'lastname': '',
            'phones': [],
            'emails': [],
        };

        let contact = getContactFormData();

        if (typeof contact == 'object' && Object.keys(contact).length > 0) {
            if (!contact.id || contact.id == 0) {
                //find maxID in contactBook
                let keys = Object.keys(contactBook);
                let maxID = 0;
                for (let index in keys) {
                    let item = keys[index];
                    let id = parseInt(item.substr(3));
                    if (id > maxID) {
                        maxID = id;
                    }
                }

                let newID = maxID + 1;

                //write ID into form and into contactBook, write contact data
                contact.id = newID;
                contactBook['id_' + newID] = {};
            }
            saveContactIntoBook(contact);
        } else {
            showError('Contact form has error :(');
        }
    }
;

let saveContactIntoBook = function (contact) {

    //write new data
    contactBook['id_' + contact.id].id = contact.id;
    contactBook['id_' + contact.id].firstname = contact.firstname;
    contactBook['id_' + contact.id].lastname = contact.lastname;
    contactBook['id_' + contact.id].phones = contact.phones;
    contactBook['id_' + contact.id].emails = contact.emails;

    hideInputContactForm();
    saveContactBook();
    displayContacts();
};

let searchContact = function () {
    //clear previous
    displayFound([]);

    let searchString = searchContactField.value.toString().toLowerCase();
    console.log('searchString = ' + searchString);

    if (searchString.length > 1){
        if (searchString) {
            //find in contacts
            let found = [];
            for (let key1 in contactBook) {
                let contact = contactBook[key1];
                // console.log (contact);

                //find in contact fields
                for (let key2 in contact) {
                    if (key2 == 'id') {
                        continue;
                    }
                    let field = contact[key2].toString().toLowerCase();
                    // console.log (field);
                    if (~field.indexOf(searchString)) {
                        console.log('was found in');
                        found.push(contact);
                        console.log(contact);
                        break;
                    }
                }
            }
            console.log('found: ' + found);

            if (found.length > 0) {
                displayFound(found);
            } else showError('Nothing found :(');

        } else showError('Please type something :)');
    } else showError('Please type more one symbol')
};

let deleteContact = function (id) {
    let contact = contactBook['id_' + id];

    delete(contactBook['id_' + id]);
    console.log(JSON.stringify(contact) + ' deleted');

    saveContactBook();
    displayContacts();
};

let displayContacts = function () {
    // console.log(contactBook);
    //clear all
    contactsView.innerHTML = '';

    //display all contacts
    for (let item in contactBook) {
        let contact = contactBook[item];
        // console.log(contact);
        let contactView = generateContactView(contact);
        contactsView.appendChild(contactView);
    }
};


//additional functions
let showInputContactForm = function () {
    addContactButton.style.display = 'none';
    contactForm.style.display = 'block';
};

let hideInputContactForm = function () {
    clearContactForm();
    addContactButton.style.display = 'block';
    contactForm.style.display = 'none';
};

let clearContactForm = function () {
    contactFormID.value = 0;
    contactFormFirstname.value = '';
    contactFormLastname.value = '';
    contactFormPhone.value = [];
    contactFormEmail.value = [];
};

let getContactFormData = function () {

    let contact = {};
    let status = true;

    //get contact ID from hidden field of contact form
    contact.id = contactFormID.value;

    //get and validate other fields
    if (contactFormFirstname.value.length > 0) {
        contact.firstname = contactFormFirstname.value;
    } else {
        status = false;
        showError('Type firstname');
    }

    if (contactFormLastname.value.length > 0) {
        contact.lastname = contactFormLastname.value;
    } else {
        status = false;
        showError('Type lastname');
    }

    if (contactFormPhone.value.length > 0) {
        contact.phones = contactFormPhone.value;
    } else {
        status = false;
        showError('Type phone');
    }

    if (contactFormEmail.value.length > 0) {
        contact.emails = contactFormEmail.value;
    } else {
        status = false;
        showError('Type email');
    }

    if (status == true) {
        return contact;
    }
    return {};
};

let expandContact = function (id) {
    let extContactView = doc.getElementById('extContact_' + id + '_View');
    let expandContactButton = doc.getElementById('expandContact_' + id + '_Button');

    expandContactButton.innerHTML = '<';
    expandContactButton.onclick = function () {
        collapseContact(id)
    };
    extContactView.style.display = 'block';
};

let collapseContact = function (id) {
    let extContactView = doc.getElementById('extContact_' + id + '_View');
    let expandContactButton = doc.getElementById('expandContact_' + id + '_Button');

    expandContactButton.innerHTML = '>';
    expandContactButton.onclick = function () {
        expandContact(id)
    };
    extContactView.style.display = 'none';
};

let generateContactView = function (contact) {
    let contactView = doc.createElement('div');

    contactView.innerHTML = /*'<hr/>' +*/ contact.firstname + '\t' + contact.lastname + '<br />';
    contactView.innerHTML += contact.phones + '\t';
    contactView.innerHTML += '<button id="expandContact_' + contact.id + '_Button" onclick = "expandContact(' + contact.id + ')">\></button>';

    contactView.appendChild(generateExtContactView(contact));
    contactView.innerHTML += '<hr/>';

    return contactView;
};

let generateExtContactView = function (contact) {
    let extContactView = doc.createElement('div');
    extContactView.id = 'extContact_' + contact.id + '_View';
    extContactView.style.display = 'none';

    extContactView.innerHTML = contact.emails + '<br/>';
    extContactView.innerHTML += '<button id="editContact_' + contact.id + '_Button" onclick = "editContact(' + contact.id + ')">Edit</button>';
    extContactView.innerHTML += '<button id="deleteContact_' + contact.id + '_Button" onclick = "deleteContact(' + contact.id + ')">Delete</button>';

    return extContactView;
};

let displayFound = function (found) {
    // console.log(found);
    //clear all
    foundView.innerHTML = '';

    //display all found contacts
    for (let item in found) {
        let contact = found[item];
        // console.log(contact);
        let contactView = generateFoundView(contact);
        foundView.appendChild(contactView);
    }
};

let generateFoundView = function (contact) {
    let contactView = doc.createElement('div');

    contactView.innerHTML = contact.firstname + '\t' + contact.lastname + '\t';
    contactView.innerHTML += contact.phones + '<br/>';
    contactView.innerHTML += contact.emails + '\t';
    contactView.innerHTML += '<button id="expandContact_' + contact.id + '_Button" onclick = "expandContact(' + contact.id + ')">Show in Book</button>';
    contactView.innerHTML += '<hr/>';

    return contactView;
};

let showSuccess = function (message) {
    let block = doc.createElement('div');
    block.innerHTML = message;
    successView.style.display = 'block';
    setTimeout(function () {
        successView.style.display = 'none';
        successView.removeChild(block);
    }, 2500);
    successView.appendChild(block);
};

let showError = function (message) {
    let block = doc.createElement('div');
    block.innerHTML = message;
    errorView.style.display = 'block';
    setTimeout(function () {
        errorView.style.display = 'none';
        errorView.removeChild(block);
    }, 2500);
    errorView.appendChild(block);
};

//buttons and input fields
let doc = window.document;

let header = doc.getElementById('header');
let contactsView = doc.getElementById('contacts-view');
let controlPanel = doc.getElementById('control-panel');

let addContactButton = doc.getElementById('add-contact-button');
let saveContactButton = doc.getElementById('save-contact-button');
let cancelAddContactButton = doc.getElementById('cancel-add-contact-button');

let contactForm = doc.getElementById('contact-form');
let contactFormID = doc.getElementById('contact-form-id');
let contactFormFirstname = doc.getElementById('contact-form-firsname');
let contactFormLastname = doc.getElementById('contact-form-lastname');
let contactFormPhone = doc.getElementById('contact-form-phone');
let contactFormEmail = doc.getElementById('contact-form-email');

let successView = doc.getElementById('alert-success');
let errorView = doc.getElementById('alert-error');

let foundView = doc.getElementById('found-view');

let searchContactField = doc.getElementById('search-contact-field');
let searchContactButton = doc.getElementById('search-contact-button');

//EventListeners
addContactButton.addEventListener('click', addContact);
saveContactButton.addEventListener('click', submitContactForm);
cancelAddContactButton.addEventListener('click', hideInputContactForm);
searchContactButton.addEventListener('click', searchContact);
searchContactField.addEventListener('input', searchContact);

////start scripts

//load contactBook from localStorage
loadContactBook();

//display all contacts
displayContacts();

// }());



