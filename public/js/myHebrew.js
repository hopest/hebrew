        $(function () {

        	// var dateTime = "900jkljh700jghj345458678768";
        	// console.log(dateTime.match(/H\d{1,4}/g));

        	$(".navbars").on("change", "#book", function () {
        		//$("#book").change(function () {
        		var book = $(this).val();
        		// chapter = $("#chapter :selected").val();
        		window.location.href = "#book/" + book + "/" + 1;
        	});

        	/**
        	 * Переход по главе
        	 */
        	$(".navbars").on("change", "#chapter", function () {
        		//$("#chapter").change(function () {
        		var c_chapter = $(this).val(),
        			c_book = $("#book :selected").val();

        		window.location.href = "#book/" + c_book + "/" + c_chapter;
        	});

        	/**
        	 * Отображение словаря Стронга, при нажатии на ссылку номеров стронга
        	 */
        	$(".hebrew-container").on("click", ".strongs", function () {
        		let text = $(this).text();

        		$.get('/strong/' + text, function (data) {
        			$.alert({
        				title: 'Номера Стронга',
        				content: data,
        				useBootstrap: false,
        				draggable: true,
        				alignMiddle: true,
        				backgroundDismiss: true,
        				boxWidth: '35%',
        				type: 'green'
        			});

        		});

        	});
        	// Поиск
        	$(".navbars").on("click", ".Find", function () {
        		var text = $("input.inputFind").val();
        		if (text == "") return;
        		$.jsPanel({
        			position: {
        				my: "center-top",
        				at: "center-top",
        				offsetY: 15
        			},
        			theme: "rebeccapurple",
        			contentSize: {
        				width: 600,
        				height: 350
        			},
        			headerTitle: "Поиск слова: " + text,
        			//contentAjax: $.get('/search/' + text),
        			contentAjax: {
        				url: '/search/' + text,
        				autoload: true,
        				//  done: function () {

        				//  }
        			}
        		});
        	});

        	$('.hebrew-container').on("mouseenter", '.rus', (function () {
        		if ($(this).hasClass("inputized") == false) {
        			$(this).inputizer(function (value) {

        				var id_data_verse = $(this).parent('.unit').data();
        				//var verse_rus = $(this);

        				$.post('/update_rus_verse/', {
        						id: id_data_verse.id,
        						rus: value
        					}).done(function (data) {
        						console.log("done",data);
        					}).fail(function (err) {
        						console.log("fail",err);
        					})
        					.always(function (mm) {
        						console.log("always",mm);
        					})

        			})
        		}
        	}));

        	/**
        	 * Редактирование русского перевода
        	 */

        	// $('.hebrew-container').on("click", '.unit .rus', (function () {
        	// 	var id_data_verse = $(this).parent('.unit').data();
        	// 	var verse_rus = $(this);

        	// 	$.confirm({
        	// 		title: 'Перевод слова',
        	// 		content: '' +
        	// 			'<form action="#">' +
        	// 			'  <div class="control">' +
        	// 			'<input class="input edit_rus" type="text" id="sample3">' +

        	// 			'</div>' +
        	// 			'</form>',
        	// 		boxWidth: '300px',
        	// 		useBootstrap: false,
        	// 		draggable: true,
        	// 		buttons: {
        	// 			formSubmit: {
        	// 				text: 'сохранить',
        	// 				btnClass: 'btn-blue',
        	// 				action: function () {
        	// 					var jedit_rus = this.$content.find('.edit_rus').val();
        	// 					if (!jedit_rus) {
        	// 						new Noty({
        	// 							type: 'error',
        	// 							layout: 'topRight',
        	// 							theme: 'mint',
        	// 							text: 'Пустая ячейка или не допустимые буквы',
        	// 							timeout: 5000,
        	// 							progressBar: true,
        	// 							closeWith: ['click', 'button'],
        	// 							animation: {
        	// 								open: 'noty_effects_open',
        	// 								close: 'noty_effects_close'
        	// 							},
        	// 							id: false,
        	// 							force: false,
        	// 							killer: false,
        	// 							queue: 'global',
        	// 							container: false,
        	// 							buttons: [],
        	// 							sounds: {
        	// 								sources: [],
        	// 								volume: 1,
        	// 								conditions: []
        	// 							},
        	// 							titleCount: {
        	// 								conditions: []
        	// 							},
        	// 							modal: false
        	// 						}).show()
        	// 						return false;
        	// 					}
        	// 					// 		$.get('/updateru/' + id_data_verse+'/'+jedit_rus, function (data) {
        	// 					// 			console.log(data);
        	// 					// });

        	// 					$.post('/update_rus_verse/', {
        	// 						id: id_data_verse.id,
        	// 						rus: jedit_rus
        	// 					}, function (data) {
        	// 						verse_rus.text(jedit_rus);
        	// 					});



        	// 				}
        	// 			},
        	// 			cancel: function () {
        	// 				//close
        	// 			},
        	// 		},
        	// 		onContentReady: function () {
        	// 			componentHandler.upgradeElements($('.mdl-textfield').get());
        	// 			this.$content.find('.edit_rus').val(verse_rus.text());
        	// 			this.$content.find('.mdl-textfield__label').text(verse_rus.text());

        	// 			// bind to events
        	// 			var jc = this;
        	// 			this.$content.find('form').on('submit', function (e) {
        	// 				// if the user submits the form by pressing enter in the field.
        	// 				e.preventDefault();
        	// 				jc.$$formSubmit.trigger('click'); // reference the button and click it
        	// 			});
        	// 		}
        	// 	});


        	// }));

        	// 	$('.navbars').on('mouseenter', '.morph', function(){
        	// 		$(this).tooltipster({

        	// 		content: 'Загрузка...',
        	// 		// 'instance' is basically the tooltip. More details in the "Object-oriented Tooltipster" section.
        	// 		functionBefore: function (instance, helper) {
        	// 			var $origin = $(helper.origin);
        	// 			var _verse = $origin.parent().data();

        	// 			if ($origin.data('loaded') !== true) {
        	// 				$.get('/morph_def/' + _verse.id, function (data) {
        	// 					instance.content(data);

        	// 					$origin.data('loaded', true);
        	// 				});
        	// 			}
        	// 		}

        	// 	}).tooltipster('open');
        	// });
        });