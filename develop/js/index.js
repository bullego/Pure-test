'use strict';
window.onload = function() {

	//____________________main-burger-menu
	var menu = document.querySelector('.main-menu__items');
	var logo = document.querySelector('.main-menu__logo-tablet');
	var btnClose = document.querySelector('.main-menu__btn-close');
	var btnOpen = document.querySelector('.main-menu__btn-open');


	btnOpen.addEventListener('click', function() {
		menu.classList.add('btn-show-f');
		logo.classList.add('btn-show-b');
		btnClose.classList.add('btn-show-b');
		btnOpen.classList.add('btn-hide');
	});

	btnClose.addEventListener('click', function() {
		menu.classList.remove('btn-show-f');
		logo.classList.remove('btn-show-b');
		btnClose.classList.remove('btn-show-b');
		btnOpen.classList.remove('btn-hide');
	});

	
	//____________________footer-list
	var pagesTitle = document.querySelector('.pages__title');
	var infoTitle = document.querySelector('.info__title');
	var socialsTitle = document.querySelector('.socials__title');
	var listsTitles = document.querySelectorAll('#list__title');


	pagesTitle.classList.add('title-hide');
	infoTitle.classList.add('title-hide');
	
	for(var i = 0; i < listsTitles.length; i++) {

		listsTitles[i].addEventListener('click', function() {
			if (this.className === 'pages__title title-hide') {
				this.classList.remove('title-hide');
			} 
			else if (this.className === 'pages__title') {
				this.classList.add('title-hide');
			}
			else if (this.className === 'info__title title-hide') {
				this.classList.remove('title-hide');
			}			 
			else if (this.className === 'info__title') {
				this.classList.add('title-hide');
			}			 
			else if (this.className === 'socials__title') {
				this.classList.add('title-hide');
			}			 
			else if (this.className === 'socials__title title-hide') {
				this.classList.remove('title-hide');
			}
		});
	};

};