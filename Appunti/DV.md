# Data Visualization
Ignorando i concetti base HTML e CSS.

## SVG
**S**calable **V**ector **G**raphics, serve per creare gtafica vettoriale. Si usa il tag `<svg> ... </svg>`.  
Esempio pratico:
```html
...
<svg height="300" width="300">
	<rect x="25" y="25" width="100" height="50"/>
	<circle cx="200" cy="70" r="50"/>
	<line x1="25" y1="100" x2="125" y2="100" stroke="black"/>
</svg>
...
```

### Rettangoli
Si usa il tag `<rect/>` si popola con: 
* `x` e `y` per le coordinate di origine
* `height`: altezza
* `width`: larghezza

### Cerchio
Si usa il tag `<circle/>` si popola con: 
* `cx` e `cy` per le coordinate del centro
* `r`: raggio

### Linee
Si usa il tag `<line/>` si popola con: 
* `x1` e `y1` per le coordinate dell'inizio
* `x2` e `y2` per le coordinate della fine
* `stroke`: colore

### Gruppi
Creare gruppi permette di **trasformazioni**, **stili** o **attributi** a tutti gli elementi che contiene.  
Si usa il tag `<g> ... </g>`, esempio pratico:
```html
...
<svg height="300" width="300">
	<g fill="none" stroke="green" stroke-width="4px">
		<rect x="25" y="25" width="100" height="50"></rect>
		<circle cx="200" cy="70" r="50"></circle>
		<line x1="25" y1="100" x2="125" y2="100" ></line>
	</g>
</svg>
...
```
In questo caso si applicano le caratteristiche `fill`, `stroke` e `stroke-width` a tutti gli elementi racchiusi nel tag `<g>`.

### Percorsi
Permette di creare linee, curve, archi e altre geometrie avanzate che non sono possibili con altri elementi SVG. Si indica con il tag `<path/>`.
* Per disegnare percorsi si utilizza il campo `d="..."` ('data'):  
	* `Mx y`: Sposta il punto di partenza del disegno alle coordinate x y (e.g. `M10 10` imposta il punto iniziale alle coordinate x=10 e y=10);
	* `Lx y`: Disegna una linea dal punto attuale al punto indicato nelle coordinate
	* `Hx` / `Vy`: Horizontal o Vertical Line, disegna una linea orizzontale o verticale verso la coordinata indicata;
	* `Z`: Chiude il percorso collegando l'ultimo punto al primo.
	* Usare lettere _MAIUSCOLE_ o _minuscole_ cambia:
		* _MAIUSCOLE_: Usano le coordinate assolute;
		* _minuscole_: Usano le coordinate rispetto al punto attuale.
* `fill`: Speciﬁca il colore di riempimento della forma;
* `stroke`: Speciﬁca il colore del bordo;
* `stroke-width`: Deﬁnisce lo spessore del bordo.

Esempio completo:
```html
...
<svg>
	<g>
		<path d="M10 150 50 100
				 L90 120 L130 80
				 L170 140 L210 60
				 L250 100 L290 50
				 L330 120 Z"
			stroke="blue"
			fill="none"
			stroke-width="2"/>
	</g>
</svg>
...
```
Quello che faremo sarà combinare tutte queste cose assieme:
```html
...
<svg>
	<g>
		<path d="M10 150 50 100
				 L90 120 L130 80
				 L170 140 L210 60
				 L250 100 L290 50
				 L330 120 Z"
			stroke="blue"
			fill="none"
			stroke-width="2"/>
		
		<circle cx="10" cy="150"  r="4" fill="red" />
		<circle cx="50" cy="100"  r="4" fill="red" />
		<circle cx="90" cy="120"  r="4" fill="red" />
		<circle cx="130" cy="80"  r="4" fill="red" />
		<circle cx="170" cy="140" r="4" fill="red" />
		<circle cx="210" cy="60"  r="4" fill="red" />
		<circle cx="250" cy="100" r="4" fill="red" />
		<circle cx="290" cy="50"  r="4" fill="red" />
		<circle cx="330" cy="120" r="4" fill="red" />
	</g>
</svg>
...
```
Applicheremo lo stile del file CSS ai vari tag o classi del file.  
```CSS
svg {		/* Stile per il tag specifico sgv */
	...
}

.red-empty-circle  {	/* Stile per la classe chiamata `red-empty-circle` */
	...
}
```
## Allegare file
* I file **CSS** si 