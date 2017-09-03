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

    //generate new clear contact form
    let contact = {
        'id': 0,
        'firstname': '',
        'lastname': '',
        'phones': [''],
        'emails': [''],
    };
    generateContactForm(contact);
};

let editContact = function (id) {
    let contact = contactBook['id_' + id];
    showInputContactForm();

    //generate and load contact form
    generateContactForm(contact);
};

let submitContactForm = function () {

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
};

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

    if (searchString.length > 1) {
        if (searchString) {
            //find in contacts
            let found = [];
            for (let key1 in contactBook) {
                let contact = contactBook[key1];

                //find in contact fields
                for (let key2 in contact) {
                    if (key2 == 'id') {
                        continue;
                    }
                    let field = contact[key2].toString().toLowerCase();
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
    //clear all
    contactsView.innerHTML = '';

    //display all contacts
    for (let item in contactBook) {
        let contact = contactBook[item];
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
    addContactButton.style.display = 'block';
    contactForm.style.display = 'none';
};

let generateContactForm = function (contact) {

    contactForm.innerHTML = '';
    contactForm.innerHTML += '<input id="contact-form-id" type="hidden" value="' + contact.id + '">';
    contactForm.innerHTML += '<input id="contact-form-firsname" type="text" placeholder="Firstname" value="' + contact.firstname + '"><br/>';
    contactForm.innerHTML += '<input id="contact-form-lastname" type="text" placeholder="Lastname" value="' + contact.lastname + '"><br/>';

    //generate phone block
    contactForm.innerHTML += '<div id="contact-form-phone-block"></div>';
    let contactFormPhoneBlock = doc.getElementById('contact-form-phone-block');
    for (let i in contact.phones) {
        let phone = contact.phones[i];
        let index = +i + 1;
        contactFormPhoneBlock.innerHTML += '<div id="contact-form-phone-' + index + '"></div>';
        let contactFormPhoneN = doc.getElementById('contact-form-phone-' + index);

        contactFormPhoneN.innerHTML += '<input id="contact-form-phone-field-' + index + '" type="text" placeholder="Phone' + index + '" value="' + phone + '">';

        //'+' for last record
        if (index != contact.phones.length) {
            contactFormPhoneN.innerHTML += ' <button id="contact-form-add-phone-button-' + index + '" onclick="removeOneMorePhone(' + index + ')">X</button><br/>';
        } else {
            contactFormPhoneN.innerHTML += ' <button id="contact-form-add-phone-button-' + index + '" onclick="addOneMorePhone(' + index + ')">+</button><br/>';
        }
    }

    //generate email block
    contactForm.innerHTML += '<div id="contact-form-email-block"></div>';
    let contactFormEmailBlock = doc.getElementById('contact-form-email-block');

    for (let i in contact.emails) {
        let email = contact.emails[i];
        let index = +i + 1;
        contactFormEmailBlock.innerHTML += '<div id="contact-form-email-' + index + '"></div>';
        let contactFormEmailN = doc.getElementById('contact-form-email-' + index);

        contactFormEmailN.innerHTML += '<input id="contact-form-email-field-' + index + '" type="text" placeholder="Email' + index + '" value="' + email + '">';

        //'+' for last record
        if (index != contact.emails.length) {
            contactFormEmailN.innerHTML += ' <button id="contact-form-add-email-button-' + index + '" onclick="removeOneMoreEmail(' + index + ')">X</button><br/>';
        } else {
            contactFormEmailN.innerHTML += ' <button id="contact-form-add-email-button-' + index + '" onclick="addOneMoreEmail(' + index + ')">+</button><br/>';
        }
    }
    contactForm.innerHTML += '</div>';

    //generate save/cancel buttons
    contactForm.innerHTML += '<button id="cancel-add-contact-button" onclick="hideInputContactForm()">Cancel</button>';
    contactForm.innerHTML += '<button id="save-contact-button" onclick="submitContactForm()">Save contact</button>';
};

let addOneMorePhone = function (index = 1) {
    //first element
    index = index || 1;

    let currentPhone = doc.getElementById('contact-form-phone-field-' + index).value;
    if (currentPhone.length > 0) {

        //replace 'addOneMorePhone' button on 'removeOneMorePhone' button
        let currentButton = doc.getElementById('contact-form-add-phone-button-' + index);
        currentButton.innerHTML = 'X';
        currentButton.onclick = "";
        currentButton.onclick = function () {
            removeOneMorePhone(index)
        };

        //add new phone field and '+ phone' button
        let newPhoneField = doc.createElement('div');
        let newIndex = index + 1;
        let phoneBlock = doc.getElementById('contact-form-phone-block');

        newPhoneField.id = 'contact-form-phone-' + newIndex;
        newPhoneField.innerHTML = '<input id="contact-form-phone-field-' + newIndex + '" type="text" placeholder="Phone' + newIndex + '">';
        newPhoneField.innerHTML += ' <button id="contact-form-add-phone-button-' + newIndex + '" onclick = "addOneMorePhone(' + newIndex + ')">+</button>';

        phoneBlock.appendChild(newPhoneField);

    } else {
        showError('Type phone');
    }
};

let addOneMoreEmail = function (index) {
    //first element
    index = index || 1;

    let currentEmail = doc.getElementById('contact-form-email-field-' + index).value;
    if (currentEmail.length > 0) {

        //replace 'addOneMoreEmail' button on 'removeOneMoreEmail' button
        let currentButton = doc.getElementById('contact-form-add-email-button-' + index);
        currentButton.innerHTML = 'X';
        currentButton.onclick = "";
        currentButton.onclick = function () {
            removeOneMoreEmail(index)
        };

        //add new email field and '+ email' button
        let newEmailField = doc.createElement('div');
        let newIndex = index + 1;
        let emailBlock = doc.getElementById('contact-form-email-block');

        newEmailField.id = 'contact-form-email-' + newIndex;
        newEmailField.innerHTML = '<input id="contact-form-email-field-' + newIndex + '" type="text" placeholder="Email' + newIndex + '">';
        newEmailField.innerHTML += ' <button id="contact-form-add-email-button-' + newIndex + '" onclick = "addOneMoreEmail(' + newIndex + ')">+</button>';

        emailBlock.appendChild(newEmailField);

    } else {
        showError('Type email');
    }
};

let removeOneMorePhone = function (index) {
    let phoneBlock = doc.getElementById('contact-form-phone-block');
    let child = doc.getElementById('contact-form-phone-' + index);
    phoneBlock.removeChild(child);
};

let removeOneMoreEmail = function (index) {
    let emailBlock = doc.getElementById('contact-form-email-block');
    let child = doc.getElementById('contact-form-email-' + index);
    emailBlock.removeChild(child);
};

let getContactFormData = function () {

    let contact = {};
    let status = true;

    let firstname = doc.getElementById('contact-form-firsname').value;
    let lastname = doc.getElementById('contact-form-lastname').value;
    let PhoneBlock = doc.getElementById('contact-form-phone-block');
    let EmailBlock = doc.getElementById('contact-form-email-block');

    //get contact ID from hidden field of contact form
    contact.id = doc.getElementById('contact-form-id').value;

    //get and validate other fields
    //firstname
    if (firstname.length > 0) {
        contact.firstname = firstname;
    } else {
        status = false;
        showError('Type firstname');
    }

    //lastname
    if (lastname.length > 0) {
        contact.lastname = lastname;
    } else {
        status = false;
        showError('Type lastname');
    }

    //phones
    let phoneInputFields = PhoneBlock.getElementsByTagName('input');
    contact.phones = [];

    for (let i = 0; i < phoneInputFields.length; i++) {
        let phone = phoneInputFields[i].value;
        if (phone.length > 0) {
            contact.phones.push(phone);
        } else {
            status = false;
            showError('Type phone');
        }
    }

    //emails
    let emailInputFields = EmailBlock.getElementsByTagName('input');
    contact.emails = [];

    for (let i = 0; i < emailInputFields.length; i++) {
        let email = emailInputFields[i].value;
        if (email.length > 0) {
            contact.emails.push(email);
        } else {
            status = false;
            showError('Type email');
        }
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
    contactView.innerHTML += contact.phones[0] + '\t';
    contactView.innerHTML += '<button id="expandContact_' + contact.id + '_Button" onclick = "expandContact(' + contact.id + ')">\></button>';

    contactView.appendChild(generateExtContactView(contact));
    contactView.innerHTML += '<hr/>';

    return contactView;
};

let generateExtContactView = function (contact) {
    let extContactView = doc.createElement('div');
    extContactView.id = 'extContact_' + contact.id + '_View';
    extContactView.style.display = 'none';

    for (let i = 1; i < contact.phones.length; i++) {
        extContactView.innerHTML += contact.phones[i] + '<br/>';
    }

    for (let index in contact.emails) {
        extContactView.innerHTML += contact.emails[index] + '<br/>';
    }

    extContactView.innerHTML += '<button id="editContact_' + contact.id + '_Button" onclick = "editContact(' + contact.id + ')">Edit</button>';
    extContactView.innerHTML += '<button id="deleteContact_' + contact.id + '_Button" onclick = "deleteContact(' + contact.id + ')">Delete</button>';

    return extContactView;
};

let displayFound = function (found) {
    let foundView = doc.getElementById('found-view');

    //clear all
    foundView.innerHTML = '';

    //display all found contacts
    for (let item in found) {
        let contact = found[item];
        let contactView = generateFoundView(contact);
        foundView.appendChild(contactView);
    }
};

let generateFoundView = function (contact) {
    let contactView = doc.createElement('div');

    contactView.innerHTML = contact.firstname + '\t' + contact.lastname + '\t';
    contactView.innerHTML += contact.phones.join(', ') + '<br/>';
    contactView.innerHTML += contact.emails.join(', ') + '\t';
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
let contactForm = doc.getElementById('contact-form');

let successView = doc.getElementById('alert-success');
let errorView = doc.getElementById('alert-error');

let searchContactField = doc.getElementById('search-contact-field');
let searchContactButton = doc.getElementById('search-contact-button');

//EventListeners
addContactButton.addEventListener('click', addContact);
searchContactButton.addEventListener('click', searchContact);
searchContactField.addEventListener('input', searchContact);

////start scripts

//load contactBook from localStorage
loadContactBook();

//display all contacts
displayContacts();

// }());



