{
	"exercises"
:
	[
		{
			"id": 1,
			"task": "<p>Für diese Übung wird zunächst das Kartenspiel Uno betrachtet. Das Spiel wird mit Karten in den 4 Farben rot,\n   blau, grün, gelb gespielt, die die Werte 0 bis 9 haben. Dazu gibt es noch weitere Karten in den Farben für den\n   Wechsel der Spielrichtung, das Ziehen von Strafkarten und das Aussetzen des nächsten Spielers. Neben den\n   Farbkarten gibt es noch schwarze Karten, einmal den Farbwunsch und dann noch Farbwunsch und Karte ziehen\n   kombiniert.<br>\n   Dabei gelten die folgende Grundregeln:</p>\n\n<ul>\n\t<li>Karten der gleichen Farbe dürfen aufeinander gelegt werden.</li>\n\t<li>Karten des gleichen Wertes dürfen aufeinander gelegt werden.</li>\n\t<li>Schwarze Karten dürfen nur auf farbige Karten gelegt werden.</li>\n</ul>\n\n<p>Das Uno-Spiel mit diesen Regeln ist recht langweilig. Von daher werden im Folgenden einige Zusatzregeln eingeführt. Wandle die\n   folgenden formulierten Regeln und Schlussfolgerungen in Aussagen um.</p>\n\n<ol>\n\t<li>Wenn die Farbe einer Karte grün ist, dann sagt der Spieler blau.</li>\n\t<li>Jede gelbe Karte, die gerade ist, hat die Farbe grün.</li>\n\t<li>Wenn die Karte gelb ist, und der Spieler nicht blau sagt, dann war die Karte ungerade oder eine\n\t    Sonderkarte.\n\t</li>\n\t<li>Wenn der Spieler nicht blau sagt, dann ist weder die Karte gelb und gerade noch ist die Farbe grün.</li>\n</ol>\n\n<p>Lege dazu für die atomaren Ausdrücke jeweils eine Variable fest und erzeugen Sie dann die entsprechenden\n   aussagenlogischen Ausdrücke. Verwende für die gesamte Aufgabe nicht mehr als 4 atomare Ausdrücke. Eine der\n   oben genannten Aussagen ist dabei kein atomarer Ausdruck.</p>\n\n<strong>Wandle die formulierten Regeln und Schlussfolgerungen in Aussagen um.</strong>",
			"credits": 6,
			"approach": "<h4>Atomare Ausdrücke</h4>\n<ul>\n\t<li>grün `iff` Karte ist grün</li>\n\t<li>sagtBlau `iff` Spieler sagt blau</li>\n\t<li>gerade `iff` Karte ist gerade</li>\n\t<li>gelb `iff` Karte ist gelb</li>\n</ul>\n\n<h4>Äquivalente aussagenlogische Ausdrücke</h4>\n<ol>\n\t<li>grün `=>` sagtBlau</li>\n\t<li>(gelb `^^` gerade) `=>` grün</li>\n\t<li>(gelb `^^` `not`sagtBlau) `=> not`gerade</li>\n\t<li>`not`sagtBlau `=> not`(gelb `^^` gerade) `^^` `not`grün</li>\n</ol>",
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"subjects": ["math"]
		},
		{
			"subjects": ["math"],
			"id": 2,
			"credits": 3,
			"task": "<p>Erstellen Sie Wahrheitstafel für die folgende Aussage:</p>\n\n<p>`(a vv b) ^^ (a vv not c) => (b ^^ not c)`</p>",
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["Wahrheitstafel"],
			"solutions": [
				"<table class=\"table table-condensed table-striped\">\n\t<tr>\n\t\t<td>`a`</td>\n\t\t<td>`b`</td>\n\t\t<td>`c`</td>\n\t\t<td>`a vv b`</td>\n\t\t<td>`a vv not c`</td>\n\t\t<td>`b ^^ not c`</td>\n\t\t<td>`(a vv b) ^^ (a vv not c)`</td>\n\t\t<td>`(a vv b) ^^ (a vv not c) => (b ^^ not c)`</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n</table>"]
		},
		{
			"subjects": ["math"],
			"id": 200,
			"credits": 3,
			"task": "<p>Erstellen Sie Wahrheitstafel für die folgende Aussage:</p>\n<p>`(a => b) ^^ (not b => not a) iff (b ^^ not c)`</p>\n",
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["Wahrheitstafel"],
			"solutions": [
				"<table class=\"table table-condensed table-striped\">\n\t<tr>\n\t\t<td>`a`</td>\n\t\t<td>`b`</td>\n\t\t<td>`c`</td>\n\t\t<td>`a => b`</td>\n\t\t<td>`not b => not a`</td>\n\t\t<td>`b ^^ not c`</td>\n\t\t<td>`(a => b) ^^ (not b => not a)`</td>\n\t\t<td>`(a => b) ^^ (not b => not a) iff (b ^^ not c)`</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t</tr>\n</table>"]
		},
		{
			"subjects": ["math"],
			"id": 3,
			"credits": 3,
			"task": "<p>Zeigen Sie ohne die Verwendung einer Wahrheitstafel,\n   dass die folgenden Aussagen jeweils äquivalent sind:</p>\n\t\t\n`not (p vv q) ^^ (p vv r)` und `not p ^^ not q ^^ r`",
			"solutions": [
				"<em>Beweis:</em>\n\n<figure>\n\t`not (p vv q) ^^ (p vv r)` (De Morgan)<br>\n\t`-= (not p ^^ not q) ^^ (p vv r)` (Distributivität)<br>\n\t`-= (not p ^^ not q ^^ p) vv (not p ^^ not q ^^ r)` (Kommutativität)<br>\n\t`-= (p ^^ not p ^^ not q ) vv (not p ^^ not q ^^ r)` (Kontradiktion)<br>\n\t`-= (0 ^^ not q ) vv (not p ^^ not q ^^ r)` (Kontradiktionsregel)<br>\n\t`-= 0 vv (not p ^^ not q ^^ r)` (Kontradiktionsregel)<br>\n\t`-= (not p ^^ not q ^^ r)`<br>\n</figure>"],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 300,
			"credits": 3,
			"task": "<p>Zeigen Sie ohne die Verwendung einer Wahrheitstafel,\n   dass die folgenden Aussagen äquivalent sind:</p>\n\n<p>`(p => q) ^^ (not p => r)` und `(q ^^ (p vv r)) vv (not p ^^ r)`</p>",
			"solutions": [
				"<em>Beweis:</em>\n\n<figure>\n\t`(p => q) ^^ (not p => r)` (Tautolgie)<br>\n\t`-= (not p vv q) ^^ (p vv r)` (Distributivität)<br>\n\t`-= not p ^^ (p vv r) vv q ^^ (p vv r)`<br>\n\t`-= r ^^ not p vv q ^^ (p vv r)`<br>\n\t`-= (q ^^ (p vv r)) vv (not p ^^ r)`<br>\n</figure>"],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 4,
			"credits": 4,
			"task": "<p>In dieser Übung sollen folgende Aussageformen betrachtet werden:</p>\n\n<ul>\n\t<li>`m(t):` Student hat Mathe am Zeitpunkt `t` verstanden.</li>\n\t<li>`h(t):` Student hat zum Zeitpunkt `t` Hunger.</li>\n\t<li>`d(t):` Zeitpunkt `t` ist am Tag.</li>\n\t<li>`n(t):` Zeitpunkt `t` ist nachts.</li>\n\t<li>`t_1 < t_2`: Zeitpunkt `t_1` trat irgendwann vor `t_2` ein.</li>\n</ul>\n\n<strong>Drücken sie folgende Sätze als prädikatenlogische Formeln aus:</strong>",
			"given": [
				"Immer wenn der Student Hunger hat, versteht er nichts von Mathe.",
				"Es kommt vor, dass der Student nachts Hunger hat.",
				"Es gibt einen erleuchtenden Moment, ab dem der Student Mathe immer verstehen wird.",
				"Zwischen zwei bestimmten Zeitpunkten (z.B. während der Prüfung) hat der Student einen Mathe-Blackout (versteht nichts mehr), aber vorher und auch hinterher hat er immer Ahnung."
			],
			"solutions": [
				"`AA t : h(t) => not m(t)`",
				"`EE t : n(t) ^^ h(t)`",
				"`EE t_0: ?t : (t_0 < t) => m(t)`",
				"<s>`EE t_0: EE t_1 : AA t : (t_0 < t) ^^ (t < t_1) <=> not m(t)`</s>"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["Prädikatenlogik"]
		},
		{
			"subjects": ["math"],
			"id": 5,
			"credits": 4,
			"task": "Drücken Sie folgende Aussagen in deutschen Sätzen aus:",
			"given": [
				"`not AA t: h(t) ^^ EE t: m(t)`",
				"`?t: ((h(t) vv n(t)) => ¬m(t))`",
				"`?t_1 ((d(t_1) ^^ EE t_2(m(t_2) ^^ t_2 < t_1 ^^ ?t_3((t_2 < t_3 ^^ t_3 < t_1) => n(t_3)))) => h(t_1))`",
				"`?t_1?t_2 ((n(t_1) ^^ n(t_2) ^^ EE t_3(t_1 < t_3 ^^ t_3 < t_2 ^^ d(t_3))) => EE t_3(t_1 < t_3 ^^ t_3 < t_2 ^^ h(t_3)))`"
			],
			"solutions": [
				"`¬?t: h(t) ^^ EE t: m(t)` (Negationsregel)<br>\t`? EE t: ¬h(t) ^^ EE t: m(t)`<br>\tManchmal hat der Student keinen Hunger und manchmal versteht er Mathe.",
				"Immer wenn der Student Hunger hat oder es Nacht ist, dann versteht er Mathe nicht.",
				"Der Student hat bei Tagesanbruch Hunger, wenn er in der Nacht davor Mathe verstanden hat.",
				"An einem Tag zwischen zwei Nächten hat der Student tagsüber mindestens einmal Hunger."
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 6,
			"credits": 0,
			"task": "<p>Betrachte die vier Universen `{0,1}, ZZ, QQ^+, RR`.</p>\n\n<strong>In welchen der Universen gelten die folgenden Aussagen:</strong>",
			"given": [
				"`EE x AA y: (x ≤ y)`",
				"`AA x EE y: (y^2 = x)`",
				"`?xEE y: ¬(y ≤ x)`",
				"`?(x,y): ((¬(y≤x)) => EE z: ¬((z≤x) vv (y≤z)))`"
			],
			"solutions": [
				"`{0,1}`",
				"`{0,1}`",
				"`ZZ, QQ^+, RR`",
				"`QQ^+, RR`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 7,
			"credits": 4,
			"task": "<p>Betrachten Sie folgende Aussageformen über `NN^+`:</p>\n\t\t\n<ul>\n\t<li>`P(x): x` besitzt genau drei verschiedene Primfaktoren `(a^t * b^y * c^z )`.</li>\n\t<li>`Q(x): x` ist durch das Quadrat einer Primzahl teilbar.</li>\n\t<li>`R(x):` die Dezimaldarstellung von `x` enthält nur Ziffern, die sich ohne Ecken und Spitzen darstellen\n\t    lassen (also 0, 6, 8, 9).\n\t</li>\n</ul>\n\n<strong>Zählen Sie die zehn kleinsten Elemente der folgenden Mengen auf:</strong>",
			"given": [
				"`M_1 := {x | P(x) ^^ ¬Q(x)}`",
				"`M_2 := {x | Q(x) ^^ R(x)}`",
				"`M_3 := {x | (¬P(x) ^^ Q(x)) vv R(x)}`",
				"`M_4 := {x | P(x) vv Q(x) vv R(x)}`"
			],
			"solutions": [
				"`{0,1}`",
				"`{0,1}`",
				"`ZZ, QQ^+, RR`",
				"`QQ^+, RR`"
			],
			"hints": ["<s>`P(x) = {30, 42, 66, 70, 78, 102, 105, 110, 114, 130, 138, 154, 165, 170, 182, 190, 195, …}`</s>\n\t`Q(x) = {4, 8, 9, 12, 16, 18, 20, 24, 25, 27, 28, 32, 36, 40, 44, 45, 48, 49, 50, 52, 54, 56, …}`\n\t`R(x) = {6, 8, 9, 60, 66, 68, 69, 80, 86, 88, 89, 90, 96, 98, 99, …}`\n"],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 8,
			"credits": 4,
			"task": "Zählen Sie die fünf kleinsten Elemente der folgenden Menge auf und geben Sie eine logische Beschreibung der Mengen analog zu Aufgabe 7 an:",
			"given": [
				"`M_1 uu M_2`",
				"`M_4 nn bar(M_1)`",
				"`M_1 setminus \\ M_3`",
				"`bar( M_4 setminus \\ M_2)`"
			],
			"solutions": [
				"`M_1 uu M_2 := {x\\ |\\ (P(x) ^^ neg Q(x)) vv (Q(x) ^^ R(x))} = { 8, 9, 30, 42 , 60, …}`",
				"<s>`M_4 nn bar M_1 := {x\\ |\\ (P(x) vv Q(x) vv R(x)) ^^ neg (P(x) ^^ neg Q(x))} = {4, 6, 8, 9, 12, …}`</s>",
				"`M_1 setminus M_3 := { x\\ |\\ (P(x) ^^ neg Q(x)) ^^ neg (( neg P(x) ^^ Q(x)) vv R(x))} = {30, 42, 70, 78, 102, …}`",
				"`bar{M_4 setminus\\ M_2} := {x\\ |\\ neg (P(x) vv Q(x) vv R(x)) vv Q(x) ^^ R(x)} = {1, 2, 3, 5 , 7, …}`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 9,
			"credits": 4,
			"task": "<p>Seien `M, U` Menge mit `O/ sub U sube M`. Betrachten Sie die folgenden Aussageformen über dem Universum aller\n   Teilmengen `X sube M`.\n   Beachten Sie dabei, dass das Universum in dieser Aufgabe Mengen enthält und es sich daher bei den `M_i` um Mengen\n   von Mengen handelt. Zum Verständnis der Aufgabe können Sie sich geeignete Elemente wählen, z.B. `M = {1,2,3,4}` und ein festes\n   `U`, und damit die zu untersuchenden `M_i` konstruieren.</p>\n\n<ul>\n\t<li>`E(X): X` enthält mindestens ein Element von `U`</li>\n\t<li>`A(X): X` enthält alle Elemente von `U`</li>\n</ul>\n\n<strong>Vergleichen Sie die folgenden Mengen paarweise.</strong>",
			"given": [
				"`M_1 = {X | E(X) }`",
				"`M_2 = {X | A(X) }`",
				"`M_3 = {X | A(X) vv neg E(X) }`",
				"`M_4 = {X | neg A(X) nn E(X) }`"
			],
			"solutions": [
				"`M_1 supe M_2`",
				"`M_1 sube bar M_3`",
				"`M_1 sup M_4`",
				"`M_2 sub M_3`",
				"`M_2 sub bar M_4`",
				"`M_3 = bar M_4`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 10,
			"credits": 2,
			"task": "<p>Beweisen sie, dass für alle Mengen `A, B, C, D sube M` folgende Aussage gilt: `(A xx B) nn (C xx D) = (A nn C) xx (B nn D)`<br>Zeigen sie zum Training einzeln `sube` und `supe`.",
			"solutions": [ "<p>Zu beweisen: `(A xx B) nn (C xx D) sube (A nn C) xx (B nn D)`</p>\n\n<figure>\n\t`(s, t) in (A xx B) nn (C xx D)` (Deﬁnition Schnittmenge)<br>\n\t`=> (s, t) in A xx B ^^ (s, t) in C xx D` (Deﬁnition Kreuzprodukt)<br>\n\t`=> s in A ^^ t in B ^^ s in C ^^ t in D` (Kommutativität)<br>\n\t`=> s in A ^^ s in C ^^ t in B ^^ t in D` (Deﬁnition Schnittmenge)<br>\n\t`=> s in (A nn C) ^^ t in (B nn D)` (Deﬁnition Kreuzprodukt)<br>\n\t`=> (s, t) in (A nn C) xx (B nn D)`<br>\n\t`=> (A xx B) nn (C xx D) sube (A nn C) xx (B nn D)`<br>\n\t`q.e.d.`\n</figure>\n\n<p>Zu beweisen: `(A xx B) nn (C xx D) supe (A nn C) xx (B nn D)`</p>\n\n<figure>\n\t`(s, t) in (A nn C) xx (B nn D)`<br>\n\t`=> s in (A nn C) ^^ t in (B nn D)` (Deﬁnition Kreuzprodukts)<br>\n\t`=> s in A ^^ s in C ^^ t in B ^^ t in D` (Deﬁnition Schnittmenge)<br>\n\t`=> s in A ^^ t in B ^^ s in C ^^ t in D` (Kommutativität)<br>\n\t`=> (s, t) in (A xx B) ^^ (s, t) in (C xx D)` (Deﬁnition Kreuzprodukt)<br>\n\t`=> (s, t) in (A xx B) nn (C xx D)` (Deﬁnition Schnittmenge)<br>\n\t`=> (A xx B) nn (C xx D) supe (A nn C) xx (B nn D)`<br>\n\t`q.e.d.`\n</figure>\n\n`(A xx B) nn (C xx D) sube (A nn C) xx (B nn D) ^^ (A xx B) nn (C xx D) supe (A nn C) xx (B nn D)`<br>\n`=> (A xx B) nn (C xx D) = (A nn C) xx (B nn D)`"],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 11,
			"credits": 2,
			"task": "Beweisen Sie für alle Relationen `T,R,S sube M^2` die Aussage: `T @ (R uu S) = (T @ R) uu (T @ S)`. Zeigen sie zum Training einzeln `supe` und `sube`.</p>",
			"solutions": [ "<p>Zu beweisen: `T @ (R uu S) sube (T @ R) uu (T @ S)`</p>\n\t\t\n<figure>\n\t`(x, y) in T @ (R uu S)` (Deﬁnition Komposition)<br>\n\t`=> EE z in M : (x, z) in T ^^ (z, y) in R uu S` (Deﬁnition Vereinigung)<br>\n\t`=> EE z in M : (x, z) in T ^^ ((z, y) in R vv (z, y) in S)` (Distributivität)<br>\n\t`=> EE z in M : ((x, z) in T ^^ (z, y) in R) vv ((x, z) in T ^^ (z, y) in S)` (Deﬁnition Komposition)<br>\n\t`=> ((x, y) in T @ R) vv ((x, y) in T @ S)` (Deﬁnition Vereinigung)<br>\n\t`=> (x, y) in (T @ R) uu (T @ S)`<br>\n\t`=> T @ (R uu S) sube (T @ R) uu (T @ S)`<br>\n\t`q.e.d.`\n</figure>\n\n<p>Zu beweisen: `T @ (R uu S) supe (T @ R) uu (T @ S)`</p>\n\t\t\n<figure>\n\t`(x, y) in (T @ R) uu (T @ S)`<br> (Deﬁnition Vereinigung)\n\t`=> (x, y) in (T @ R) vv (x, y) in (T @ S)` (Deﬁnition Komposition)<br>\n\t`=> EE z_1, z_2 in M : ((x, z_1) in T ^^ (z_1, y) in R) vv ((x, z_2) in T ^^ (z_2, y) in S)` (`z = (z_1 vv z_2)`)<br>\n\t`=> EE z in M : ((x, z) in T ^^ (z, y) in R) vv ((x, z) in T ^^ (z, y) in S)` (Distributivität)<br>\n\t`=> EE z in M : (x, z) in T ^^ ((z, y) in R vv (z, y) in S)` (Deﬁnition Vereinigung)<br>\n\t`=> EE z in M : (x, z) in T ^^ ((z, y) in R uu S)` (Deﬁnition Komposition)<br>\n\t`=> (x, y) in T @ (R uu S)`<br>\n\t`=> T @ (R uu S) supe (T @ R) uu (T @ S)`<br>\n\t`q.e.d.`\n</figure>\n\t\t\n<figure>\n\t`T @ (R uu S) sube (T @ R) uu (T @ S) ^^ T @ (R uu S) supe (T @ R) uu (T @ S)`<br>\n\t`=> T @ (R uu S) = (T @ R) uu (T @ S)`\n</figure>"],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 12,
			"credits": 4,
			"task": "<p>Zeichnen Sie in den Graphen `@ -> @ larr @ -> @ -> @` zusätzliche Kanten ein\n   (so wenige wie möglich, jeweils für jede Teilaufgabe),\n   so dass die Kantenrelation folgende Eigenschaften erfüllt:</p>",
			"given": [
				"Symmetrie",
				"Reflexivität",
				"Transitivität",
				"Symmetrie und Transitivität"
			],
			"solutions": [
				"<p>Gerichtete Kanten gibt es immer in beide Richtungen.</p><img src='img/12-a.png' alt=' '/>",
				"<p>Jeder Knoten hat eine Kante zu sich selbst.</p><img src=img/12-b.png alt=' '/>",
				"<p>Zwei Knoten die über einen weiteren Knoten gerichtet miteinander verbunden sind, sind in die gleiche Richtung verbunden.</p><img src=img/12-c.png>",
				"<p>Siehe a. und c.</p><img src=img/12-d.png alt=' '/>"
			],
			"solutions2": [
				"1->2; 3->2; 3->4; 4->5",
				"1->2; 3->2; 3->4; 4->5; 1->1; 2->2; 3->3; 4->4; 5->5",
				"1->2; 3->2; 3->4; 4->5; 3->5",
				"1->1; 1->2; 1->3; 1->4; 1->5; 2->1; 2->2; 2->3; 2->4; 2->5; 3->1; 3->2; 3->3; 3->4; 3->5; 4->1; 4->2; 4->3; 4->4; 4->5; 5->1; 5->2; 5->3; 5->4; 5->5"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["graph"]
		},
		{
			"subjects": ["math"],
			"id": 13,
			"credits": 4,
			"task": "<p>Sei E die Kantenrelation des Graphen aus Aufgabe 12.\n   Zeichnen Sie jeweils die Kanten der folgenden Kantenrelationen in den Graphen aus Aufgabe 12.</p>",
			"given": [
				"`E @ E`",
				"`E^(?1)`",
				"`E^(?1) @ E`",
				"`{ (x,y) | EE z:(z,x) in E ^^ (y,z) inE }`"
			],
			"solutions": [
				"<img src=img/12-c.png alt=''>",
				"<img src=img/13-b.png alt=''>",
				"<img src=img/13-c.png alt=''>",
				"<img src=img/13-d.png alt=''>"
			],
			"solutions2": [
				"1->2; 3->2; 3->4; 4->5; 3->5",
				"<img src=img/13-b.png alt=''>",
				"1->2; 3->2; 3->4; 4->5; 2->2; 2->2; 2->4; 4->2; 4->4; 5->5",
				"1->2; 3->2; 3->4; 4->5; 5->3"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["graph"]
		},
		{
			"subjects": ["math"],
			"id": 14,
			"credits": 4,
			"task": "Entscheiden Sie mit einer kurzen natürlichsprachlichen Begründung, welche der Relationen R über die Menge M aller Foursquare-Nutzer Äquivalenzen sind.",
			"given": [
				"`xRy` genau dann, wenn `x` und `y` gegenseitige Foursquare-Freunde sind.",
				"`xRy` genau dann, wenn `x` und `y` mindestens einen gemeinsamen Foursquare-Freund haben.",
				"`xRy` genau dann, wenn `x` und `y` die gleiche Anzahl an Foursquare-Checkins haben.",
				"`xRy` genau dann, wenn `x` und `y` gemeinsam an einer Foursquare-Location eingecheckt haben."
			],
			"solutions": [
				"Keine Äquivalenzrelation, da man nicht mit sich selbst befreundet sein kann und sie somit nicht reflexiv ist.",
				"Keine Äquivalenzrelation, denn wenn man mit zwei anderen Personen jeweils einen gemeinsamen Freund hat, heißt das nicht, dass diese beiden auch einen gemeinsamen Freund haben müssen.",
				"Äquivalenzrelation, da man gleich viele check-ins wie man selber hat und wenn man gleich viele hat wie jemand anderes, dieser auch gleich viele hat wie man selbst und wenn man gleich viele hat wie zwei andere diese beiden auch gleich vielehaben.",
				"Annahme: Man kann zu verschiedenen Zeiten an einem Ort einchecken.<br> Keine Äquivalenzrelation, denn wenn man mit zwei Personen jeweils gemeinsam an einem Ort eingecheckt ist heißt das nicht, dass diese gemeinsam an einem Ort eingecheckt haben müssen."
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["relation", "menge"]
		},
		{
			"subjects": ["math"],
			"id": 15,
			"credits": 4,
			"task": "<p>Sei `M` eine beliebige Menge mit `R sube M^2`</p>\n\n<p>Zeigen sie:</p>",
			"given": [
				"Wenn `R` gleichzeitig reflexiv, symmetrisch und antisymmetrisch ist, folgt `R = id_M`",
				"Genau dann, wenn `R` transitiv ist, gilt `R @ R sube R`"
			],
			"solutions": [
				"<figure>\n\tSei `(x,y) in R` (Definition reflexiv, symmetrisch, antisymmetrisch)<br>\n\t`=> xRx ^^ xRy ^^ yRx ^^ (xRy ^^ yRx -> x=y)` (`a => b = neg a v b`)<br>\n\t`=> xRx ^^ xRy ^^ yRx ^^ (neg (xRy ^^ yRx) vv x=y)` (De Morgan)<br>\n\t`=> xRx ^^ xRy ^^ yRx ^^ (neg xRy vv neg yRx vv x=y)` (Definition Identitätsrelation: y = x)<br>\n\t`=> xRx ^^ xRx ^^ xRx ^^ (neg xRx vv neg xRx vv x=x)` (Tautolgie)<br>\n\t`=> xRx ^^ xRx ^^ xRx` (Tautologie)<br>\n\t`=> xRx`<br>\n\t`q.e.d.`<br>\n\t<s>Kein abgeschlossener Beweis!</s>\n</figure>",
				"<figure>\n\t<s>\n\t\t`(x,y) in R @ R` (Definition `@`)<br>\n\t\t`=> EEz : (x,z) in R ^^ (z,y) in R` (Distributivgesetz)<br>\n\t\t`=> EEz : ((x,z) ^^ (z,y)) in R` (Definition Transitivität)<br>\n\t\t`=> (x,y) in R`<br>\n\t\t`q.e.d.`<br>\n\t</s>\n</figure>\n<figure>\n\t<s>Rückrichtung</s>\n</figure>"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof", "Menge"]
		},
		{
			"subjects": ["math"],
			"id": 16,
			"credits": 4,
			"task": "<p>Überprüfen sie, ob `Z = {Z_i\\ |\\ i >= 0}` eine gültige Zerlegung der Menge `M` ist\n   und geben sie dann die entsprechende Äquivalenzrelation an:</p>",
			"given": [
				"`M = NN` und `Z_i = {x\\ |\\ (i < 13) ^^ EE k((k in NN) ^^ (13k + i = x)}`",
				"`M = QQ^+` und `Z_i = {x\\ |\\ EE p((p in NN) ^^ (x · i = p))}`",
				"`M = RR_0^+` und `Z_i={x\\ |\\ (i≤x)^^(x < i+1)}`",
				"`M = RR_0^+` und `Z_i = {x\\ |\\ i \"ist die Quersumme von\" x}`"
			],
			"solutions": [
				"`R = {(x, y)\\ |\\ x mod 13 = y mod 13}`<br><s>`Z_i = O/ =>` keine Zerlegung</s>",
				"Nein, keine Zerlegung der Menge, da z.B. `2` in `Z_1` und `Z_2` auftaucht",
				"`R = {(x, y)\\ |\\  |__ x __| = |__ y __|}`",
				"Nein, da die Quersumme nur für natürliche Zahlen definiert ist und somit nicht alle reelen Zahlen in einer Partition auftauchen."
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"flags": ["incorrect"],
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 17,
			"credits": 4,
			"task": "Sei F linksvollständig und rechtseindeutig, `f = (A, B, F)` und `M sube N sube A`.",
			"given": [
				"Zeigen Sie `f(M) sube f(N)`",
				"Finden Sie kleine Mengen A, B, M, N und eine Abbildung `f = (A, B, F)` mit `f(M) sube f(N)`, aber `not (M sube N)`"
			],
			"solutions": [
				"Zu zeigen:<br>\n`f(M) sube f(N)` (Definition Teilmenge)<br>\n`= x in f(M) => x in f(N)`<br>\n<br>\nSei `x in f(M)` (Definition Bild)<br>\n`=> EE m in M : x = f(m)` `(M sube N)`<br>\n`=> EE m in N : x = f(m)` (Definition Bild)<br>\n`=> x in f(N)`<br>\n`q.e.d`",
				"`A = {1,2,3}`<br>\n`B = {4}`<br>\n`F = {(1,4), (2,4), (3,4)}`<br>\n`M = {1,2}`<br>\n`N = {1,3}`<br>\n<br>\n`f(M) = 4`<br>\n`f(N) = 4`<br>"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 18,
			"credits": 4,
			"task": "<p>Seien A und B nichtleere Mengen und `f : A ? B` Abbildung. Für `a,b in A` gelte `a ? b <=> f(a) = f(b)`.</p>\n\n<p>Zeigen Sie:</p>",
			"given": [
				"`?` ist äquivalenz",
				"`f^(?1)(f(a)) = [a]` für alle `a in A`"
			],
			"solutions": [
				"reflexiv: `f(a) = f(a)`<br>\nsymmetrisch: `f(a) = f(b) => f(b) = f(a)`<br>\ntransitiv: `(f(a) = f(b)) ^^ (f(b) = f(c)) => f(a) = f(c)`<br>\n`=>` ist äquivalenz<br>\n`q.e.d`",
				"`f^(-1)(f(a))` (Definition Urbild)<br>\n`= {a in A | f(a) in f(a)}` (Angabe)<br>\n`= {a in A | a ~ a}` (Definition Äquivalenzklasse)<br>\n`= [a]`<br>\n`q.e.d`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 19,
			"credits": 4,
			"task": "<p>Seien A, B, C Mengen und `f : A ? B` und `g : B ? C` Abbildungen. Dann ist `g @ f` Abbildung `A ? C`:</p>\n\n<p>Zeigen Sie:</p>",
			"given": [
				"`f` und `g` surjektiv `=> g @ f` surjektiv",
				"`f` und `g` injektiv `=> g @ f` injektiv"
			],
			"solutions": [
				"`(g @ f)(A)`<br>\n`= g(f(A))`<br>\n`= g(B)`<br>\n`= C`<br>\n`=> g @ f` ist surjektiv<br>\n`q.e.d`",
				"Seien `a_1, a_2 in A`<br>\n`=> (g @ f)(a_1) = (g @ f)(a_2)`<br>\n`=> g(f(a_1)) = g(f(a_2))` (g injektiv)<br>\n`=> f(a_1) = f(a_2)` (f injektiv)<br>\n`=> a_1 = a_2`<br>\n`=> g @ f` ist injektiv<br>\n`q.e.d`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 20,
			"credits": 3,
			"task": "<p>Sei gegeben `M = {a, b, c}`</p>\n\t\t\n<p>Gebe eine Halbordnung `R` an, so dass `R` die jeweils folgenden Eigenschaften besitzt:</p>",
			"given": [
				"`R` ist eine Ordnungsrelation",
				"Es gibt ein Minimum und zwei maximale Elemente",
				"Es gibt zwei minimale Elemente und ein Maximum"
			],
			"solutions": [
				"Anordnung der Buchstaben im lateinischen Alphabet:<br>`R = {(a,a), (b,b), (c,c), (a,b), (b,c), (a,c)}`",
				"`R = {(a,a), (b,b), (c,c), (a,b), (a,c)}`",
				"`R = {(a,a), (b,b), (c,c), (a,c), (b,c)}`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 21,
			"credits": 4,
			"task": "<p>Erweitere die folgenden Relation `R ? M ? M` mit `M = {1, 2, 3, 4, 5, 6, 7})` um so wenig Elemente wie möglich,\n   so dass die neue Relation eine Halbordnung ist.</p>\n\n<p>Bestimme die maximalen Ketten der Relation.</p>",
			"given": [
				"`R = {(1,1), (3,2), (1,3), (4,5), (5,6)}`",
				"`R = {(1,2), (2,3), (4,5), (6,5), (7,1)}`"
			],
			"solutions": [
				"`R_(Ho) `\n`= R uu {(2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (1,2), (4,6)}`\n`= {(1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (1,3), (3,2), (1,2), (4,5), (5,6), (4,6)}`<br>\n<br>\nMaximale Ketten:<br>\n`K_1 = {1, 3, 2}`<br>\n`K_2 = {4, 5, 6}`<br>\n`K_3 = {7}`",
				"`R_(Ho) `\n`= R uu {(1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (7,2), (7,3), (1,3)}`\n`= {(1,1), (2,2), (3,3), (4,4), (5,5), (6,6), (7,7), (7,1), (1,2), (2,3), (7,2), (7,3), (1,3), (4,5), (6,5)}`<br>\n<br>\nMaximale Ketten:<br>\n`K_1 = {7, 1, 2, 3}`<br>\n`K_2 = {4, 5}`<br>\n`K_3 = {6, 5}`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 22,
			"credits": 4,
			"task": "<p>Sei `(p_i)_(i in N)` eine Folge, die alle Primzahlen injektiv aufzählt.\n   Sie können nun für jedes `k in NN` jedes beliebige Tupel\n   `bar(a) = (a_1, …, a_k) in NN^k` wie folgt auf eine natürliche Zahl abbilden:<br/>\n\t<br>\n   `bar(a) |-> p_1^(a_1) * p_2^(a_2) * … * p_(k-1)^(a_(k-1)) * p_k^(a_(k+1))`</p>\n\n\n<p>Diese Abbildung von `NN^(**) := uu_(k in N) NN^k` nach `NN^+` soll `f` heißen: `f : NN^(**) -> NN^+`\n   Außerdem werde das leere Tupel `epsilon in NN^0` auf `1` abgebildet.</p>\n<strong>Zeigen Sie:</strong>",
			"given": [
				"`f` ist injektiv",
				"`f` ist surjektiv"
			],
			"solutions": [
				"Zu zeigen: `f(a) = f(b) => a = b`<br>\nSei `f(a), f(b), k in NN`<br>\n`f(a) = f(b)`<br>\n`EE bar(a) = (a_1, …, a_k), bar(b) = (b_1, …, b_k) in NN^k :\np_1^(a_1) * p_2^(a_2) * … * p_(k-1)^(a_(k-1)) * p_k^(a_(k+1)) =\np_1^(b_1) * p_2^(b_2) * … * p_(k-1)^(b_(k-1)) * p_k^(b_(k+1))` (Definition der Funktion)<br>\n`=> bar(a) = bar(b)`",
				"Zu zeigen: `f(A) = NN`<br>\n`NN sube f(A)`<br>\nSei `b, k in NN` <br>\n`=> EE bar(a) in NN^k : f(bar(a)) = b` (Definition: Für jede Zahl existiert eine Primfaktorzerlegung)<br>\n<br>\n`f(A) sube NN` folgt aus der Funktion<br>\n`=> f` ist surjektiv<br>\n`q.e.d`"
			],
			"hints": ["Um die Aufgabe besser zu verstehen, legen Sie sich `p_1` bis `p_5` fest und bilden Sie 0 bis 5-Tupel mittels `f` auf natürliche Zahlen ab. So erkennen Sie, warum der letzte Exponent als einziger `a_k + 1` heißt."],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 23,
			"credits": 2,
			"task": "<p>`f: P(NN) -> [0, 1]`</p>\n<strong>Konstruieren Sie eine Surjektion</strong>",
			"solutions": [
				"Sei `a_i in {0, …, 9}`<br>\n<br>\n`f: P(NN) -> [0, 1]`<br>\n`= {a_0, a_0a_1, a_0a_1a_2, a_0a_1a_2a_3, …} -> 0,a_0a_1a_2a_3…`<br>\n<br>\nIst surjektiv: `AA p in P(NN) : EE r in RR: f(p) = r`,<br>\naber nicht injektiv: `{1} -> 1` und `{1, 10} -> 1`"
			],
			"hints": ["Sie können verwenden, dass es zu jeder reellen Zahl `x in [0, 1]` eine Darstellung<br>\n`x = sum_(i >= 1) 2^(?i)a_i` mit `a_i in {0, 1}` gibt,<br>\ndie Binärdarstellung `0, a_1, a_2, a_3, …` des unendlichen Bruchs.\nSie müssen also nur für `M sube NN` die passenden `a_i` definieren und zeigen, dass Ihre Abbildung surjektiv ist."],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": [""]
		},
		{
			"subjects": ["math"],
			"id": 24,
			"credits": 4,
			"task": "Zeigen Sie: `AA m,n in NN : m <= n -> 2^m <= 2^n`",
			"solutions": [
				"`2^m <= 2^n` (`log_2`)<br>\n`-= log_2 2^m <= log_2 2^n`<br>\n`-= m <= n`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"tags": ["proof"]
		},
		{
			"subjects": ["math"],
			"id": 25,
			"credits": 4,
			"task": "Beweise sie mittels Widerspruch, dass sich `root 3 2` nicht als Bruch `p / q` darstellen lässt.",
			"solutions": [
				"`a in NN`<br>\n`root a 2 = p/q`<br>\n`2 = p^a/q^a`<br>\n`2q^a = p^a`\n`=> 2 | p^a`\n`=> 2 | p`\n`=> EE r in NN : p = 2r`<br>\n`2q^a = (2r)^a`<br>\n`q^a = 2^(a-1)r^a`\n`=> 2 | q^a`\n`=> p not _|_ q`\n`=> ?`"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"hints": ["Nehmen Sie an, dass `p / q` mit `p,q in NN` vollständig gekürzt ist, d.h. `ggT(p,q) = 1`.\nSie können auch verwenden, dass wenn `x | y^2` mit `x, y in NN` gilt und `x` Primzahl ist,\ndann gilt auch `x^2 | y^2` und `x | y`."],
			"tags": ["proof"]
		},
		{
			"id": 26,
			"subjects": ["math"],
			"task": "Zeigen Sie mit Hilfe eines kombinatorischen Beweises, dass folgende Aussage gilt:<br> Wenn sich eine Gruppe von `k` Kindern eine Tüte mit `10k + 1` Bonbons teilt, so gibt es ein Kind, das mindestens `11` Bonbons bekommt.",
			"created": "2013-01-01T12:00",
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"solutions": [
				"<strong>Induktionsbasis:</strong><br> `n = 0`<br> `sum_(k=1)^0 2k ? 1 = 0^2`<br> <br> <strong>Induktionsvoraussetzung:</strong><br> `EE a in NN: sum_(k=1)^a 2k ? 1 = a^2`<br> <br> <strong>Induktionsschluss:</strong><br> `sum_(k=1)^(a+1) 2k ? 1`<br> `= sum_(k=1)^a 2k ? 1 + 2(a + 1) - 1` (Induktionsvoraussetzung)<br> `= a^2 + 2a + 2 - 1`<br> `= a^2 + 2a + 1` (1.Binomische Regel)<br> `= (a + 1)^2`<br> <span class='qed'>?</span>"],
			"flags": ["unapproved"]
		},
		{
			"id": 27,
			"subjects": ["math"],
			"task": "Zeigen Sie mit Hilfe der vollständigen Induktion, dass für alle natürlichen Zahlen n gilt:<br> `sum_(k=1)^n 2k ? 1 = n^2`",
			"created": "2013-01-01T12:00",
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"solutions": [
				"<strong>Induktionsbasis:</strong><br> `n = 0`<br> `sum_(k=1)^0 2k ? 1 = 0^2`<br> <br> <strong>Induktionsvoraussetzung:</strong><br> `EE a in NN: sum_(k=1)^a 2k ? 1 = a^2`<br> <br> <strong>Induktionsschluss:</strong><br> `sum_(k=1)^(a+1) 2k ? 1`<br> `= sum_(k=1)^a 2k ? 1 + 2(a + 1) - 1` (Induktionsvoraussetzung)<br> `= a^2 + 2a + 2 - 1`<br> `= a^2 + 2a + 1` (1.Binomische Regel)<br> `= (a + 1)^2`<br> <span class='qed'>?</span>"],
			"flags": ["unapproved"]
		},
		{
			"id": 28,
			"subjects": ["math"],
			"task": "<p>Zeigen Sie, dass bei der folgenden Formel zwar der Induktionsschritt funktioniert, jedoch nicht die Induktionsbasis:<br>\n   `sum_(k=0)^n k^3 = (n^2(n + 1)^2)/4 ? 1`<br>\n   Die Behauptung muss dennoch falsch sein.\n   Man sieht also, dass eine bewiesene Induktionsbasis essenziell für einen vollständigen Induktionsbeweis ist.</p>\n   ",
			"created": "2013-01-01T12:00",
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"solutions": [
				"<strong>Induktionsbasis:</strong><br> `n = 0`<br> a: `sum_(k=0)^0 k^3 = 0`<br> b: `(0^2(0 + 1)^2)/4 ? 1 = -1`<br> `=> a != b`<br> <br> <strong>Induktionsvoraussetzung:</strong><br> `EE a in NN: sum_(k=0)^a k^3 = (a^2(a + 1)^2)/4 ? 1`<br> <br> <strong>Induktionsschluss:</strong><br> `sum_(k=0)^(a+1) k^3`<br> `= sum_(k=0)^a k^3 + (a + 1)^3`<br> `= (a^2(a + 1)^2)/4 ? 1 + (a+1)(a+1)^2`<br> `= (a^2(a + 1)^2)/4 ? 1 + (4(a+1)(a+1)^2)/4` (Distributivgesetz)<br> `= ((a + 1)^2 (a^2 + 4(a+1)))/4 ? 1` (Distributivgesetz)<br> `= ((a + 1)^2 (a^2 + 4a + 4))/4 ? 1` (Binomische Formel)<br> `= ((a + 1)^2 (a + 2)^2)/4 ? 1`<br> `= ((a + 1)^2 ((a + 1) + 1)^2)/4 ? 1`<br> <span class='qed'>?</span>"],
			"flags": ["unapproved"]
		},
		{
			"id": 29,
			"subjects": ["math"],
			"created": "2013-01-01T12:00",
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"solutions": [
				"Durch das zweite Herausschicken betrachtet man wieder nur eine Person und nicht `n + 1 = 2` Personen. Somit wird die Anforderung an den Induktionsschritt nicht erfüllt und es kann auch keine Aussage über die Richtigkeit der Behauptung gemacht werden."],
			"flags": ["unapproved"],
			"task": "Zeigen sie, warum folgender Beweis fehlerhaft ist: <strong>Behauptung:</strong><br> Auf einer Party mit `n ≥ 1` Gästen haben alle denselben Namen.<br> <br> <strong>Induktionsbasis:</strong><br> Wenn auf einer Party nur ein Gast ist, ist die Aussage wahr (weil es nur einen Namen gibt).<br> <br> <strong>Induktionsschritt: </strong><br> Seien auf einer Party `n + 1` Gäste. Wir schicken einen raus. Dann sind auf dieser Party nur noch `n` Gäste. Nach Induktionsvoraussetzung haben all diese `n` Gäste den gleichen Namen. Nun holen wir den Gast der draußen steht wieder rein und schicken einen anderen Gast raus. Nun haben nach Induktionsvoraussetzung wieder alle den gleichen Namen. Also müssen alle `n + 1` Gäste den gleichen Namen haben. Daraus folgt, dass alle Gäste auf einer Party gleich heißen."
		},
		{
			"id": 301,
			"subjects": ["math"],
			"created": "2013-01-01T12:00",
			"credits": 3,
			"given": [
				"`n^4 ? 4n^2` ist durch `3` teilbar."
			],
			"solutions": [
				"<strong>Induktionsbasis:</strong>\n<br>\n<p>`n = 0`<br>\n   `=> (n^4 - 4n^2) | 3`<br>\n   `=> (0^4 - 4 * 0^2) | 3`<br>\n   `=> 0 | 3`\n</p>\n\n\n<strong>Induktionsvorraussetzung:</strong>\n<br>\n<p>`AA n in NN: (n^4 - 4n^2) | 3`</p>\n\n\n<strong>Induktionsschluss:</strong>\n<br>\n`(n + 1)^4 - 4(n + 1)^2`<br>\n`= n^4 + 4n^3 + 6n^2 + 4n + 1 - 4n^2 + 8n - 4`<br>\n`= n^4 + 4n^3 + 2n^2 - 4n - 3`<br>\n`= (n^4 - 4n^2 ) + (4n^3 + 6n^2 - 4n - 3)`<br>\n`= (n^4 - 4n^2 ) + (3n^3 + 6n^2 - 3n - 3) + (n^3 - n)`<br>\n`= (n^4 - 4n^2 ) + 3(n^3 + 2n^2 - n - 1)+ n(n^2 - 1)`<br>\n`= (n^4 - 4n^2 ) + 3(n^3 + 2n^2 - n - 1) + n (n - 1)(n+1)`<br>\n<br>\n<p>Nun sind alle 3 Summanden durch 3 teilbar:</p>\n<ol>\n\t<li>Nach Induktionsvoraussetzung</li>\n\t<li>Ganzes vielfaches von 3</li>\n\t<li>Von den 3 aufeinanderfolgenden Zahlen `(n-1)`, `n` und `(n+1)`\n\t    muss eine durch 3 teilbar sein\n\t</li>\n</ol>\n<p> Somit ist auch die Summe durch 3 teilbar.</p>"
			],
			"hints": ["asdfas", "asdfasdfaesgas", "asefasgawegasg"],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"flags": ["unapproved"],
			"tags": ["induction"],
			"task": "Zeigen Sie mit Hilfe der vollständigen Induktion: Für alle natürlichen Zahlen `N` (inkl. der 0) gilt:"
		},
		{
			"id": 302,
			"subjects": ["math"],
			"created": "2013-01-01T12:00",
			"credits": 3,
			"given": [
				"Die Potenzmenge einer `n`-elementigen Menge enthält `2^n` Elemente."
			],
			"solutions": [
				"<strong>Induktionsbasis:</strong>\n\n<p>`n = 0`<br>\n   `=> #M = 0`<br>\n   `=> M = O/`<br>\n   `=> P(M) = {O/}`<br>\n   `=> #P(M) = 1 = 2^0`<br>\n</p>\n\n\n<strong>Induktionsvorraussetzung:</strong>\n\n<p>`AA n in NN: #P(M) = 2^n`\n</p>\n\n\n<strong>Induktionsschluss:</strong>\n\n<p>Sei `M_(n+1)` eine Menge für die gelte:<br>\n   `#M_(n+1) = (n+1)`<br>\n   `M_(n+1) = {e_1, e_2, …, e_(n+1)}`<br>\n\t<br>\n   Nun betrachen wir die Teilmenge `M_n`. Es gilt:<br>\n   `P(M_n) = 2^n` (Induktionsvorraussetzung)<br>\n   `P(M_n) = {T(1), …, T(2^n)}`<br>\n\t<br>\n   `=> P(M_(n+1)) = {T(1), …, T(2^n), T(1) uu {e_(n+1)}, …, T(2^n) uu {e_(n+1)} }`<br>\n   `=> #P(M_(n+1))\n   = 2^n + 2\n   = 2 * 2^n\n   = 2^(n+1)`<br>\n</p>\n"
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"flags": ["unapproved"],
			"tags": ["induction"],
			"task": "Zeigen Sie mit Hilfe der vollständigen Induktion: Für alle natürlichen Zahlen `N` (inkl. der 0) gilt:"
		},
		{
			"id": 31,
			"subjects": ["math"],
			"task": "Nennen sie die Anzahl aller Zeichenfolgen `(a_1, … , a_n)` mit der Länge `n in N` über `{A, … , Z}`",
			"created": "2013-01-01T12:00",
			"credits": 1122,
			"difficulty": 0.5,
			"given": [
				"Es kommt kein Zeichen mehrfach vor.",
				"Das ’A’ kommt genau k-mal vor.",
				"Genau ein Zeichen kommt mindestens doppelt vor.",
				"Genau drei Zeichen kommen jeweils genau doppelt vor."
			],
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"flags": ["incorrect"],
			"solutions": [
				"<p>a) Nur möglich für `n <= 26`: `26/((26-n)!)`</p>\n\t\t",
				"<p>b) `((n),(k))` Möglichkeiten für die `A`s und `25^(n-k)` für die restlichen Stellen:`((n),(k)) * 25^(n-k)`</p>",
				"<p>c) `26 * sum_(k=2)^n( ((n),(k)) * ((25),(n-k)) * k!)`</p>",
				"<s>d) Missing</s>"
			],
			"tags": ["stochastik"]
		},
		{
			"id": 32,
			"subjects": ["computer-science"],
			"flags": ["incorrect"],
			"task": "<p>`f(x, y, z) = (x ? y ? z ) ? ( ¬x ? y )`</p>\n<p>`g(x, y, z) = x ? ( y ? z )`</p>\n<p>`h(x, y, z) = (x ? y) ? (x ? y) ? z`</p>\n\t\t\n<p>Erzeugen Sie die disjunktive Normalform DNF(f) und die konjunktive Normalform KNF</p>",
			"solutions": [
				"<table class=\"table table-condensed table-striped\">\n\t<tr>\n\t\t<th>x</th>\n\t\t<th>y</th>\n\t\t<th>z</th>\n\t\t<th>f1 ? x?y?z</th>\n\t\t<th>f2 ? ¬x?y</th>\n\t\t<th>f(x,y,z) f1?f2</th>\n\t\t<th>g(x,y,z) x?(y?z)</th>\n\t\t<th>f3 ? x?y</th>\n\t\t<th>h(x,y,z) f3?(x?y) ? z</th>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0</td>\n\t\t<td>1</td>\n\t</tr>\n</table>\n\n<h4>DNF</h4>\n<p>`f (x, y, z) ``= (¬x ? ¬y ? z) ? (¬x ? y ? ¬z) ? (x ? ¬y ? z) ? (x ? y ? ¬z) ? (x ? y ? z) ``= (x ? y) ? (y ? ¬z) ? (¬y ? z)`</p>\n<p>`g (x, y, z) ``= (x ? ¬y ? z) ? (x ? y ? ¬z) ? (x ? y ? z) ``= (x?y)?(x?z)`</p>\n<p>`h (x, y, z) ``= (¬x ? ¬y ? z) ? (¬x ? y ? ¬z) ? (¬x ? y ? z) ? (x ? ¬y ? ¬z) ? ``(x ? ¬y ? z) ? (x ? y ? ¬z) ? (x ? y ? z) ``=\n   x?y?z`</p>\n\n<h4>KNF</h4>\n<p>`f (x, y, z) ``= (x ? y ? z) ? (x ? ¬y ? ¬z) ? (¬x ? y ? z) ``= (x ? ¬y ? ¬z) ? (y ? z)`</p>\n<p>`g (x, y, z) ``= (x ? y ? z) ? (x ? y ? ¬z) ? (x ? ¬y ? z) ? (x ? ¬y ? ¬z) ? (¬x ? y ? z) ``= x ? (y ? z)`</p>\n<p>`h (x, y, z) ``= x ? y ? z`</p>"],
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"created": "2013-01-20T12:00"
		},
		{
			"id": 33,
			"subjects": [ "math", "computer-science"],
			"task": "<p>Stellen Sie die folgenden Zahlen binär, oktal und hexadezimal dar:</p>\n\n<p>`68_9, 118_11, 550_6 ,1810_10`</p>",
			"solutions": [
				"<table class=\"table table-striped table-condensed\">\n\t<thead>\n\t<tr>\n\t\t<th>Zahl</th>\n\t\t<th>Binär</th>\n\t\t<th>Oktal</th>\n\t\t<th>Hex</th>\n\t</tr>\n\t</thead>\n\t<tbody>\n\t<tr>\n\t\t<td>`68_9`</td>\n\t\t<td>1111110</td>\n\t\t<td>76</td>\n\t\t<td>3E</td>\n\t</tr>\n\t<tr>\n\t\t<td>`118_11`</td>\n\t\t<td>10001100</td>\n\t\t<td>214</td>\n\t\t<td>8C</td>\n\t</tr>\n\t<tr>\n\t\t<td>`550_6`</td>\n\t\t<td>11010010</td>\n\t\t<td>322</td>\n\t\t<td>D2</td>\n\t</tr>\n\t<tr>\n\t\t<td>`1810_10`</td>\n\t\t<td>11100010010</td>\n\t\t<td>3422</td>\n\t\t<td>712</td>\n\t</tr>\n\t</tbody>\n</table>"],
			"credits": 3,
			"difficulty": 0.5,
			"flags": ["unapproved"],
			"created": "2013-01-20T12:00"
		},
		{
			"id": 34,
			"subjects": ["computer-science"],
			"task": "<p>Geben Sie folgende Dezimalzahlen im Zweierkomplement in Binärdarstellung und Hexadezimaldarstellung an:</p>\n\n<p>`-1, 1, 28, -35, -256, 257`</p>",
			"solutions": [
				"<table class=\"table table-striped table-condensed\">\n\t<thead>\n\t<tr>\n\t\t<th>Dezimal</th>\n\t\t<th>Binär</th>\n\t\t<th>Zweierkomplement</th>\n\t\t<th>Hex</th>\n\t</tr>\n\t</thead>\n\t<tbody>\n\t<tr>\n\t\t<td>-1</td>\n\t\t<td>-1</td>\n\t\t<td>1111 1111 1111 1111</td>\n\t\t<td>FFFF</td>\n\t</tr>\n\t<tr>\n\t\t<td>1</td>\n\t\t<td>1</td>\n\t\t<td>0000 0000 0000 0001</td>\n\t\t<td>0001</td>\n\t</tr>\n\t<tr>\n\t\t<td>28</td>\n\t\t<td>11100</td>\n\t\t<td>0000 0000 0001 1100</td>\n\t\t<td>001C</td>\n\t</tr>\n\t<tr>\n\t\t<td>-35</td>\n\t\t<td>-100011</td>\n\t\t<td>1111 1111 1101 1101</td>\n\t\t<td>FFDD</td>\n\t</tr>\n\t<tr>\n\t\t<td>-256</td>\n\t\t<td>-100000000</td>\n\t\t<td>1111 1111 0000 0000</td>\n\t\t<td>FF00</td>\n\t</tr>\n\t<tr>\n\t\t<td>257</td>\n\t\t<td>100000001</td>\n\t\t<td>0000 0001 0000 0001</td>\n\t\t<td>0101</td>\n\t</tr>\n\t</tbody>\n</table>"],
			"credits": 3,
			"difficulty": 0.5,
			"tags": ["two's complement"],
			"flags": ["unapproved"],
			"created": "2013-01-20T12:00"
		},
		{
			"id": 35,
			"subjects": ["computer-science"],
			"task": "Terminalsymbole: `a, b, c`<br>\nHilfssymbole: `X, Y, Z`<br>\n<br>\n`X ::= (a b a)^**`<br>\n`Y ::= c | a Y b | b Y a`<br>\n`Z ::= [X] [Y]`<br>\n\n<p>Geben sie 5 Symbolfolgen an, die aus den Symbolen erzeugt werden können.</p>",
			"solutions": [
				"<h4>Start X</h4>\n<ol>\n\t<li>leere Zeichenfolge</li>\n\t<li>aba</li>\n\t<li>abaaba</li>\n\t<li>abaabaaba</li>\n\t<li>abaabaabaaba</li>\n</ol>\n\n<hr>\n<h4>Start Y</h4>\n<ol>\n\t<li>c</li>\n\t<li>acb</li>\n\t<li>bca</li>\n\t<li>aacbb</li>\n\t<li>bbcaa</li>\n</ol>\n\n<hr>\n<h4>Start Z</h4>\n<ol>\n\t<li>leere Zeichenfolge</li>\n\t<li>aba</li>\n\t<li>c</li>\n\t<li>abac</li>\n\t<li>ababbcaa</li>\n</ol>"],
			"credits": 3,
			"difficulty": 0.5,
			"tags": ["BNF"],
			"flags": ["unapproved"],
			"created": "2013-01-01T12:00"
		},
		{
			"id": 36,
			"subjects": ["programming"],
			"task": "Schreibe ein Shellskript, das 10 Dateien mit eindeutigem Namen erzeugt",
			"solutions": [
				"<pre><code>\n#!/bin/bash\n\ndirname=files\nfilename=file_0\ncounter=0\n\nwhile [ -d \"$dirname\" ]\ndo\n\tdirname=\"${dirname%_*}\"_$counter\n\t(( counter++ ))\ndone\n\nmkdir \"$dirname\"\ncd \"$dirname\"\ncounter=0\n\nfor a in {0..9}\ndo\n\twhile [ -e \"$filename\" ]\n\tdo\n\t\tfilename=\"${filename%_*}\"_$counter\n\t\t(( counter++ ))\n\tdone\n\t\n\ttouch \"$filename\"\ndone\n</code></pre>"],
			"credits": 3,
			"difficulty": 0.5,
			"tags": ["shell", "bash"],
			"flags": ["unapproved"],
			"created": "2013-01-20T12:00"
		},
		{
			"id": 37,
			"subjects": ["programming"],
			"task": "<p>Schreibe ein Shellskript, das in einem Verzeichnis rekursiv nach der Textdatei mit den meisten Wörtern sucht.\n   Der Verzeichnisname soll als Kommandozeilenparameter übergeben werden.\n   Wird kein Parameter übergeben, so soll die Suche im Heimatverzeichnis beginnen.</p>",
			"solutions": [
				"<pre><code>#!/bin/bash\n\nfind ${1:-~} -exec file {} \\; | grep \"text\" | sed -e \"s/:.*$//g\" | tr \\\\n \\\\0 | xargs -0 wc -w | sort | tail -2 | head -1\n</code></pre>"],
			"credits": 3,
			"difficulty": 0.5,
			"tags": ["shell", "bash"],
			"flags": ["unapproved"],
			"created": "2013-01-20T12:00"
		},
		{
			"id": 38,
			"subjects": ["math"],
			"task": "<p>Die Fibonacci-Zahlen `F_n, n in NN_0`, sind definiert durch `F_0 = 0`, `F_1 = 1`, `F_(n+2) = F_n + F_(n+1)`.\n   Zeigen Sie mit Hilfe der vollständigen Induktion:</p>",
			"given": [
				"`sum_(k=0)^n F_(2k+1) = F_(2n+2)`"
			],
			"solutions": [
				"<p>Sei `p(n) := sum_(k=0)^n F_(2k+1) = F_(2n+2)` mit `Fn:` Fibonacci- Zahl von `n`.<br>\n   Zu zeigen : `AAn in NN : p(n)`\n</p>\n<br>\n\n<strong>Induktionsbasis:</strong><br>\nSei n = 0, zu Zeigen: p(0) ist wahr.<br>\n`sum_(k=0)^0 F_(2k+1) = F_1 = F_2 = F_(2*0+2)`<br>\n<span class=\"qed\"></span>\n<br>\n\n<strong>Induktionsschritt:</strong><br>\nZu zeigen: `AAn ? N : p(n) ? p(n + 1)`<br>\n<p>Sei `n in N` beliebig aber fest.</p>\n\t\t\n`p(n)`<br>\n`=> sum_(k=0)^n F_(2k+1) = F_(2n+2)` `| +F_(2(n+1)+1)`<br>\n`=> F_(2(n+1)+1) + sum_(k=0)^n F_(2k+1) = F_(2(n+1)+1) + F_(2n+2)`<br>\n`=> F_(2(n+1)+1) + sum_(k=0)^n F_(2k+1) = F_(2n+2) + F_(2n+3)` `|\"Definition\" Fib`<br>\n`=> F_(2(n+1)+1) + sum_(k=0)^n F_(2k+1) = F_(2n+4)` `|\"Defintion\" Sigma`<br>\n`=> sum_(k=0)^(n+1) F_(2k+1) = F_(2(n+1)+2)`<br>\n`=> p(n+1)`<br>\n<span class=\"qed\"></span>\n<br>\n<p>Aus der Induktionsbasis und dem Induktionsschritt folgt die Korrektheit von `p(n)` für alle `n in N`.</p>"
			],
			"credits": 6,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 32a",
			"tags": ["proof", "fibonacci", "induction"],
			"created": "2013-01-21T12:00"
		},
		{
			"id": 46,
			"subjects": ["math"],
			"task": "<p>Die Fibonacci-Zahlen `F_n, n in NN_0`, sind definiert durch `F_0 = 0`, `F_1 = 1`, `F_(n+2) = F_n + F_(n+1)`.</p>\n\n<strong>Zeigen Sie mit Hilfe der vollständigen Induktion:</strong>",
			"given": [
				"`F_(n+1)^2 = F_n * F_(n+1) + (-1)^n`"],
			"solutions": [
				"<strong>Gegenbeispiel zu b):</strong>\n<br>\n`F_(n+1)^2 = F_n * F_(n+1) + (-1)^n` (`n = 2`)<br>\n`F_(2+1)^2 = F_2 F_(n+1) + (-1)^n`<br>\n`F_3^2 = F_2 F_3 + (-1)^2`<br>\n`4 = 2+1`<br>\n`4 = 3`<br>\nfalsch!"],
			"credits": 6,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 32b",
			"tags": ["proof", "fibonacci", "induction"],
			"flags": ["unapproved"],
			"created": "2013-01-21T12:00"
		},
		{
			"id": 39,
			"subjects": ["math"],
			"task": "Geben sie die Anzahl der verschiedenen Möglichkeiten an (inklusive Begründung). Ein Reisebus transportiert `n` HPI-Studenten nach Berlin. Der Bus hält am Zoo, am Hauptbahnhof und am Alex. Wir interessieren uns für die Zahl der Studenten, die dort jeweils aussteigen.",
			"solutions": [
				"Das Problem wie viele Möglichkeiten es gibt n nicht unterscheidbare Personen auf 3 Ausstiegsmöglichkeiten zu verteilen\nist gleichbedeutend mit der Anzahl der k-Kombinationen aus einer n-Menge zu der Trennstriche dazugehören um die Aufteilung darzustellen<br>\nEs soll angenommer werden, dass alle Personen aussteigen müssen. <br>\n<br>\n`((n+3-1),(n))`"],
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 33",
			"flags": ["unapproved"],
			"created": "2013-01-21T12:00"
		},
		{
			"id": 40,
			"subjects": ["math"],
			"task": "<p>Gegeben sei diese Formel: `sum_(i=0)^n x^(i-4)+3i+sqrt(i) * x`</p>\n\n<strong>Ersetze die Laufvariable `i` durch die Ausdrücke und vereinfache soweit wie möglich.</strong>",
			"given": [
				"`j + 10`",
				"`j/3 - 5`",
				"`sqrt(j)`"
			],
			"solutions": [
				"`sum_(j+10=0)^n x^(j+10-4) + 3(j+10) + sqrt(j+10) * x`<br>\n`= sum_(j=-10)^n x^(j+6) + 3j + 30 + sqrt(j+10) * x`<br><br>\n",
				"`sum_(j/3-5=0)^n x^(j/3-5-4) + 3(j/3-5) + sqrt(j/3-5) * x`<br>\n`sum_(j=15)^n x^(j/3-9) + j-15 + sqrt(j/3-5) * x`<br>\n<br>",
				"`sum_(sqrt(j)=0)^n x^(sqrt(j)-4) + 3sqrt(j) + sqrt(sqrt(j)) * x`<br>\n`sum_(sqrt(j)=0)^n x^(sqrt(j)-4) + 3sqrt(j) + root(4) j * x`<br>\n"
			],
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 34",
			"flags": ["unapproved"],
			"created": "2013-01-21T12:00"
		},
		{
			"id": 41,
			"subjects": ["math"],
			"task": "<p>Urne A enthält 7 rote und 3 schwarze Kugeln,\n   Urne B enthält 3 rote und 2 schwarze Kugeln,\n   Urne C enthält 1 rote und 4 schwarze Kugeln und Urne D enthält 2 weiße und 2 schwarze Kugeln.\n   Es wird zufällig eine Urne ausgewählt und hieraus eine Kugel gezogen.\n   Ohne Zurücklegen wird beides danach wiederholt.</p>\n\n<strong>Berechne die Wahrscheinlichkeit und begründe:</strong>",
			"given": [
				"Berechne die Wahrscheinlichkeit als erstes eine rote Kugel zu ziehen",
				"Es wurde als erstes eine rote Kugel gezogen. Berechne die Wahrscheinlichkeit mit der sie aus Urne A, B, C oder D stammt",
				"Berechne die Wahrscheinlichkeit auch als zweites eine rote Kugel zu ziehen",
				"Es wurde auch als zweites eine rote Kugel gezogen. Berechne die Wahrscheinlichkeit mit der sie aus Urne A, B, C oder D stammt"
			],
			"solutions": [
				"<p>a) Wahrscheinlichkeit eine bestimmte Urne auszuwählen:<br>\n   `P(A) = P(B) = P(C) = P(D) = 1/4`</p>\n\t\t\n<p>r := rote Kugel ziehen</p>\n\t\t\n`P(r) = P(A nn r) + P(B nn r) + P(C nn r) + P(D nn r)`<br>\n`= 1/4 * 7/10 + 1/4 * 3/5 + 1/4 * 1/5 + 1/4 * 0`<br>\n`= 7/40 + 3/20 + 1/20`<br>\n`= 7/40 + 6/40 + 2/40`<br>\n`= 15/40`<br>\n`= 3/8`<br>"
				, "b)<br>\n`P_r(A) = (P(A nn r))/(P(r)) = (7/40)/(3/8) = 7/15`<br>\n`P_r(B) = (P(B nn r))/(P(r)) = (3/20)/(3/8) = 2/5`<br>\n`P_r(C) = (P(C nn r))/(P(r)) = (1/20)/(3/8) = 2/15`<br>\n`P_r(D) = 0`<br>"
				, "c)<br>\n`P(r, r) = 1/4 * (7/10 * 1/4 * (6/9 + 3/5 + 1/5)``+ 3/5 *  1/4 * (7/10 + 2/4 + 1/5)``+ 1/5 * 1/4 * (7/10 + 3/5 + 0) + 0)``= 319/2400`<br>"
				, "d)<br>\n`P_(2r)(A)`\n`= (P(A nn r_2))/(P(r_2))`\n`= (1/16 * (7/10 * 2/3 + 3/5 * 7/10 + 1/5 * 7/10))/(319/2400)`\n`= (1/16 * 77/75)/(319/2400)`\n`= 154/319`\n`= 14/29`<br>\n\t\t\n`P_(2r)(B)`\n`= (P(B nn r_2))/(P(r_2))`\n`= (1/16 * (7/10 * 3/5 + 3/5 * 2/4 + 1/5 * 3/5))/(319/2400)`\n`= 126/319`<br>\n\n`P_(2r)(C)`\n`= (P(C nn r_2))/(P(r_2))`\n`= (1/16 * (7/10 * 1/5 + 3/5 * 1/5 + 1/5 * 0))/(319/2400)`\n`= 39/319`<br>"
			],
			"credits": "1 2 2 2",
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 35",
			"created": "2013-01-27T18:00"
		},
		{
			"id": 42,
			"subjects": ["math"],
			"task": "<p>Gegeben sei ein Pokerspiel mit 52 Karten verteilt auf 13 verschiedene Werte und 4 Farben.\n   Ein Blatt besteht aus 5 Karten. Das sogenannte Full-House beschreibt ein Blatt mit 2 gleichen Werten und 3 gleichen Werten.</p>\n\n<strong>Berechne die Anzahl der verschiedenen Blätter für ein Full House und begründe.</strong>",
			"solutions": [
				"<ul>\n\t<li>13 Möglichkeiten, den Typ (z.B. König) des Drillings auszuwählen</li>\n\t<li>3 aus den 4 Königen</li>\n\t<li>12 Möglichkeiten, den Typ des Paars auszuwählen (eine ist schon verbraucht)</li>\n\t<li>2 aus 4 von dem Paar</li>\n</ul>\n\n<br>\n`((13),(1)) * ((4),(3)) * ((12),(1)) * ((4),(2)) = 3744`"],
			"credits": 3,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 36",
			"created": "2013-01-27T18:00"
		},
		{
			"id": 43,
			"subjects": ["math"],
			"task": "<p>Zwei anonyme Studenten geben identische Lösungen zur Matheübung ab.\n   Um dies zu verschleiern, geben sie die Lösungen mit verschiedenen Übungsgruppen ab.\n   Jedoch gibt es nur drei Korrektoren, auf die die vier Gruppen zufällig verteilt werden.\n   (Jeder Korrektor bekommt mindestens eine Gruppe zugeordnet).</p>\n\n<strong>Berechne die Wahrscheinlichkeit mit der die beiden Lösungen von dem gleichen Korrektor bewertet werden.</strong>",
			"solutions": [
				"Wahrscheinlichkeit die Lösung eines Studenten zu bekommen: `1/2`<br>\nWahrscheinlichkeit dann auch noch die Lösung des zweiten zu bekommen: `1/2 * 1/3 = 1/6`"],
			"credits": 2,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 37",
			"created": "2013-01-27T18:00"
		},
		{
			"id": 44,
			"subjects": ["math"],
			"task": "<p>Beim Wurf von `3` fairen Würfeln tritt die Summe `10` öfter auf als die Summe `9`.<br>\n   Beide Summen können allerdings jeweils auf genau `6` Arten erzeugt werden:</p>\n\n`10 = 1 + 3 + 6`<br>\n`= 1 + 4 + 5`<br>\n`= 2 + 2 + 6`<br>\n`= 2 + 3 + 5`<br>\n`= 2 + 4 + 4`<br>\n`= 3 + 3 + 4`<br>\n\n<br>\n\n`9 = 1 + 2 + 6`<br>\n`= 1 + 3 + 5`<br>\n`= 1 + 4 + 4`<br>\n`= 2 + 2 + 5`<br>\n`= 2 + 3 + 4`<br>\n`= 3 + 3 + 3`<br>\n\n<strong>Erläutern sie warum die Summe 10 öfter vorkommt.</strong>",
			"solutions": [
				"<h4>Anzahl der Möglichkeiten die Kombinationen zu würfeln:</h4>\n\n\n<table class=\"table table-striped table-condensed\">\n\t<caption>Für 10</caption>\n\t<tr>\n\t\t<td>`1,3,6`</td>\n\t\t<td>`3! = 6`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`1,4,5`</td>\n\t\t<td>`3! = 6`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`2,2,6`</td>\n\t\t<td>`((3),(2)) = 3`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`2,3,5`</td>\n\t\t<td>`3! = 6`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`2,4,4`</td>\n\t\t<td>`((3),(2)) = 3`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`3,3,4`</td>\n\t\t<td>`((3),(2)) = 3`</td>\n\t</tr>\n\t<tr>\n\t\t<td>Gesamt</td>\n\t\t<td>`27`</td>\n\t</tr>\n</table>\n\n<table class=\"table table-striped table-condensed\">\n\t<caption>Für 9</caption>\n\t<tr>\n\t\t<td>`1,2,6`</td>\n\t\t<td>`3! = 6`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`1,3,5`</td>\n\t\t<td>`3! = 6`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`1,4,4`</td>\n\t\t<td>`((3),(2)) = 3`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`2,2,5`</td>\n\t\t<td>`3! = 6`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`2,3,4`</td>\n\t\t<td>`((3),(2)) = 3`</td>\n\t</tr>\n\t<tr>\n\t\t<td>`3,3,3`</td>\n\t\t<td>`((3),(3)) = 1`</td>\n\t</tr>\n\t<tr>\n\t\t<td>Gesamt</td>\n\t\t<td>`25`</td>\n\t</tr>\n</table>\n\t\t\n<p>Es gibt 2 Möglichkeiten mehr die Summe 10 zu würfeln.\n   Somit wird die Summe 10 im Durchschnitt auch öfter gewürfelt werden.</p>"],
			"credits": 1,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 38",
			"tags": ["proof"],
			"created": "2013-01-27T18:00"
		},
		{
			"id": 45,
			"subjects": ["math"],
			"task": "Beweise, dass in einer Gruppe von acht Leuten (mindestens) zwei am gleichen Wochentag Geburtstag haben.",
			"solutions": [
				"`A = \"Personen\"`<br>\n`B = \"Wochentage\"`<br>\n<br>\n`f: A -> B`<br>\n<br>\n`#A = 8`<br>\n`#B = 7`<br>\n<br>\n`#f^(-1)(b) >= |~ (#A)/(#B) ~| >= |~ 8/7 ~| >= 2`"],
			"credits": 1,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013",
			"tags": ["proof", "pigeonhole principle"],
			"created": "2013-02-10T18:00"
		},
		{
			"id": 47,
			"subjects": ["math"],
			"task": "<p>In der Mensa sitzen 100 Studenten und essen, 60 Studenten reden und 20 Studenten lesen Zeitung.\n   23 dieser Studenten essen und reden gleichzeitig, 5 essen und lesen Zeitung, 3 reden und lesen Zeitung und einer isst,\n   redet und liest gleichzeitig.</p>\n\n<strong>Wieviele Studenten sind in der Mensa?</strong>",
			"solutions": [
				"`E = \"Essenden\"`<br>\n`R = \"Redenden\"`<br>\n`L = \"Lesenden\"`<br>\n<br>\n`#E = 100`<br>\n`#R = 60`<br>\n`#L = 20`<br>\n<br>\n<p>Die Studenten, die verschiedenes zugleich machen, finden sich in den Schnittmengen wieder:</p>\n`#(E nn R) = 23`<br>\n`#(E nn L) = 5`<br>\n`#(R nn L) = 3`<br>\n`#(E nn R nn L) = 1`<br>\n<br>\n<p>Die Anzahl der Studenten in der Mensa ist somit `100 + 60 + 20 ? 23 ? 5 ? 3 + 1 = 150`.</p>"],
			"credits": 1,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013",
			"tags": ["combinatorics"],
			"created": "2013-02-10T18:00"
		},
		{
			"id": 48,
			"subjects": ["math"],
			"task": "Berechne die Anzahl der Möglichkeiten beim Lotto 6 aus 49 Zahlen zu ziehen.",
			"solutions": [
				"<p>`[(49),(6)]` liefert die Anzahl aller Permutationen von `6` der `49` Zahlen. <br>\nBeim Lotto kommt es jedoch nicht auf die Reihenfolge in der die Zahlen gezogen werden an.\nDie beiden verschiedenen Permutationen `3, 43, 22, 6, 17, 11` und `22, 11, 17, 6, 43, 3`\nliefern beide die Menge `{3, 6, 11, 17, 22, 43}` als Ergebnis der Ziehung.\nFür jede `6`-elementige Menge gibt es `6!` Permutationen.</p>\n`([(49),(6)])/(6!)`\n`= ((49),(6))`\n`= (49!)/(6! * (49 - 6)!)`\n`= (49 * 48 * 47 * 46 * 45 * 44)/(1 * 2 * 3 * 4 * 5 * 6)`\n`= 13983816`"],
			"credits": 1,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013",
			"tags": ["combinatorics"],
			"created": "2013-02-10T18:00"
		},
		{
			"id": 49,
			"subjects": ["math"],
			"task": "<p>X sei die Anzahl der Einserpäsche nach dem 10 Wurf von zwei fairen Würfeln.</p>\n   \n<strong>Berechne den Erwartungswert und die Standardabweichung der Zufallsvariable:</strong>",
			"solutions": [
				"<p>Es handelt sich um einen Bernoulli-Versuch und somit können die Formeln für Binominalverteilungen angewendet werden.<br>\n   Anzahl der Würfe: `n = 10` <br>\n   Wahrscheinlichkeit für einen Pasch: `p = 1/36`<br>\n\t<br>\n   Erwartungswert: `E[X] = n * p = 5/18`<br>\n   Standardabweichung: `sigma[X] = sqrt(Var[X]) = sqrt(n * p * q) = sqrt(175/648)`</p>"],
			"credits": 2,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 39a",
			"tags": ["stochastic"],
			"created": "2013-02-11T18:00"
		},
		{
			"id": 50,
			"subjects": ["math"],
			"task": "<p>X sei die Anzahl der Würfe von zwei faieren Würfeln bis zum ersten Einserpasch.</p>\n\n<strong>Berechne den Erwartungswert und die Standardabweichung der Zufallsvariable.</strong>",
			"solutions": [
				"Wahrscheinlichkeit für einen Pasch: `p=1/36`<br>\n\tEs handelt sich um eine geometrische Verteilung. <br>\n\t\n\tErwartungswert: `E[X] = 1/p = 36`<br>\n\tStandardabweichung: `sigma[X] = sqrt(Var[X]) = sqrt(q/p^2) = sqrt 1260 ~~ 35.5`"],
			"credits": 2,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 39b",
			"tags": ["stochastic"],
			"created": "2013-02-11T18:00"
		},
		{
			"id": 51,
			"subjects": ["math"],
			"task": "<p>Bei der Herstellung von Smartphones ist mit einem Ausschuss von `5%` zu rechnen.\nEine Kiste Smartphones enthält 100 Stück.</p>\n\t\t\n<strong>Berechne den Erwartungswert und die Standardabweichung für die Anzahl der defekten Handys X\nund die funktionierenden Handys Y</strong>",
			"solutions": [
				"Es handelt sich um binominal verteilte Zufallsgrößen. <br>\n`n = 100` <br>\n`P(X) = p = 0.05` <br>\n`P(Y) = q = 1 - p = 0.95` <br>\n<br>\n`E[X] = n * p = 5`<br>\n`E[Y] = n * q = 95`<br>\n<br>\n`sigma[X]`\n`= sigma[Y]`\n`= sqrt(Var[x])`\n`= sqrt(n * p * q)`\n`= sqrt(100 * 0.05 * 0.95)`\n`= sqrt(4.75)` \n`~~ 2.18`"],
			"credits": 2,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 40a",
			"tags": ["stochastic"],
			"created": "2013-02-11T18:00"
		},
		{
			"id": 52,
			"subjects": ["math"],
			"task": "<p>Bei der Herstellung von Smartphones ist mit einem Ausschuss von `5%` zu rechnen.\nEine Kiste Smartphones enthält 100 Stück.</p>\n\t\t\n<strong>Berechne die Wahrscheinlichkeit, dass die Anzahl der defekten Handys im Bereich\n`U = [mu - sigma, mu + sigma]` mit `mu` Erwartungswert und `sigma` Standardabweichung liegt.</strong>",
			"solutions": [
				"`U = [2.82, 7.18]`<br>\n<br>\n`P(X in U)`<br>\n`= sum_(k=3)^7 B(k | 100, 0.05)`<br>\n`= B(3 | 100, 0.05) + B(4 | 100, 0.05) + B(5 | 100, 0.05)``\\ \\ + B(6 | 100, 0.05) + B(7 | 100, 0.05)`<br>\n`~~ 0.7537`"],
			"credits": 2,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 40b",
			"tags": ["stochastic"],
			"created": "2013-02-11T18:00"
		},
		{
			"id": 53,
			"subjects": ["math"],
			"task": "<p>Bei der Herstellung von Smartphones ist mit einem Ausschuss von `5%` zu rechnen.\n   Eine Kiste Smartphones enthält 100 Stück.</p>\n\n\n<strong>Berechne die maximale Anzahl an Handys die in der Kiste vorhanden sein dürfen,\n        damit man mit 90% Sicherheit nur brauchbare Handys hat. Berechne die Anzahl</strong>",
			"solutions": [
				"`0.95^n >= 90%` `\\ |log` <br>\n`n >= log_(0.95)0.9`<br>\n`n >= (ln 0.9)/(ln 0.95)`<br>\n`n >= 2.0540797…`<br>\n`=> n = 2`"],
			"credits": 2,
			"difficulty": 0.5,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, WS 2012/2013, Nr. 40c",
			"tags": ["stochastic"],
			"created": "2013-02-11T18:00"
		}
	]
}