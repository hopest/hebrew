        $(function () {
        	$("#c_hebrew").on("change", "#book", function () {
        		debugger
        		var book = $(this).val();
        		// chapter = $("#chapter :selected").val();
        		window.location.href = "#book/" + book + "/" + 1;
        	});

        	/**
        	 * Переход по главе
        	 */
        	$("#c_hebrew").on("change", "#chapter", function () {
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
        	$("#c_hebrew").on("click", ".Find", function () {
        		var text = $("input.inputFind").val();
        		var jn_curr = ""; //Текущая книга
        		var jn_strong_verse = ""; //Добавить Стронг в стих
        		var jn_better_find = ""; //Добавить Стронг в стих
debugger
        		if ($('.curr_book').prop('checked')) {
        			var _curr = $(".rtl.heb-content").data("book");
        			jn_curr = "?currbook=" + _curr;
        		}

        		// Стронг в стихах
        		if ($('.strong_verse').prop('checked')) {
        			if (jn_curr != "") {
        				jn_strong_verse = "&jn_strong_verse=true";
        			} else {
        				jn_strong_verse = "?jn_strong_verse=true";
        			}
        		}
        		// Точность в поиске
        		if ($('.better_find').prop('checked')) {
        			if (jn_curr != "") {
        				jn_better_find = "&jn_better_find=true";
        			} else {
        				jn_better_find = "?jn_better_find=true";
        			}
        		}

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
        				url: '/search/' + text + jn_curr + jn_strong_verse + jn_better_find,

        				autoload: true,
        				done: function (data, textStatus, jqXHR, panel) {
        					var cont = this.content.append(data);

        					cont.unmark({
        						done: function () {
        							cont.mark(text);
        						}
        					});

        				},
        			},

        			callback: function () {


        			}
        		});
        	});

        	$('.hebrew-container').on("click focus", '.rus', (function () {
        		if ($(this).hasClass("inputized") == false) {
        			$(this).inputizer(function (value) {
        				var id_data_verse = $(this).parent('.unit').data();
        				//var verse_rus = $(this);

        				$.post('/update_rus_verse/', {
        						id: id_data_verse.id,
        						rus: value
        					}).done(function (data) {
        						console.log("done", data);
        					}).fail(function (err) {
        						console.log("fail", err);
        					})
        					.always(function (mm) {
        						console.log("always", mm);
        					})

        			})
        		}
        	}));

        });