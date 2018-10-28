
```html
{{code/triangle.html}}
```


We’ll come back to initGL and initShaders later on, as they’re important in
understanding how the page works, but first, let’s take a look at initBuffers
and drawScene.

initBuffers first taking it step by step:

```js
var triangleVertexPositionBuffer
var squareVertexPositionBuffer
```
We declare two global variables to hold the buffers.
(In any real-world WebGL page
you wouldn’t have a separate global variable for each object in the scene, but
we’re using them here to keep things simple, as we’re just getting started.)

Next:

```js
function initBuffers() {
	triangleVertexPositionBuffer = gl.createBuffer()
```

We create a buffer for the triangle’s vertex positions.
Vertices (don’t you just love irregular plurals?) are the points in 3D space that define the shapes we’re drawing.
For our triangle, we will have three of them (which we’ll set up in a
minute). This buffer is actually a bit of memory on the graphics card by putting
the vertex positions on the card once in our initialisation code and then, when
we come to draw the scene, essentially just telling WebGL to "draw those things
I told you about earlier", we can make our code really efficient, especially
once we start animating the scene and want to draw the object tens of times
every second to make it move. Of course, when it’s just three vertex positions
as in this case, there’s not too much cost to pushing them up to the graphics
card — but when you’re dealing with large models with tens of thousands of
vertices, it can be a real advantage to do things this way. Next:

```js
 gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
```

This line tells WebGL that any following operations that act on buffers should
use the one we specify. There’s always this concept of a "current array buffer",
and functions act on that rather than letting you specify which array buffer you
want to work with. Odd, but I’m sure there a good performance reasons behind it…

```js
 var vertices = [
	0.0,  1.0, 0.0,
	-1.0, -1.0, 0.0,
	1.0, -1.0, 0.0
]
```

Next, we define our vertex positions as a JavaScript list. You can see that
they’re at the points of an isosceles triangle with its centre at (0, 0, 0).

```
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
```

Now, we create a Float32Array object based on our JavaScript list, and tell
WebGL to use it to fill the current buffer, which is of course our
triangleVertexPositionBuffer. We’ll talk more about Float32Arrays in a future
lesson, but for now all you need to know is that they’re a way of turning a
JavaScript list into something we can pass over to WebGL for filling its
buffers.

```
triangleVertexPositionBuffer.itemSize = 3
triangleVertexPositionBuffer.numItems = 3
```

The last thing we do with the buffer is to set two new properties on it. These
are not something that’s built into WebGL, but they will be very useful later
on. One nice thing (some would say, bad thing) about JavaScript is that an
object doesn’t have to explicitly support a particular property for you to set
it on it. So although the buffer object didn’t previously have itemSize and
numItems properties, now it does. We’re using them to say that this 9-element
buffer actually represents three separate vertex positions (numItems), each of
which is made up of three numbers (itemSize).

Now we’ve completely set up the buffer for the triangle, so it’s on to the
square:

```js
	squareVertexPositionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)
	vertices = [
		 1.0, 1.0,  0.0,
		 -1.0,  1.0,  0.0,
		  1.0, -1.0,  0.0,
		  -1.0, -1.0,  0.0
	]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
	squareVertexPositionBuffer.itemSize = 3
	squareVertexPositionBuffer.numItems = 4
}
```

All of that should be pretty obvious — the square has four vertex positions
rather than 3, and so the array is bigger and the numItems is different.

OK, so that was what we needed to do to push our two objects’ vertex positions
up to the graphics card. Now let’s look at drawScene, which is where we use
those buffers to actually draw the image we’re seeing. Taking it step-by-step:

```
 function drawScene() { 	gl.viewport(0, 0, gl.viewportWidth,
gl.viewportHeight)
```

The first step is to tell WebGL a little bit about the size of the canvas using
the viewport function we’ll come back to why that’s important in a (much!) later
lesson for now, you just need to know that the function needs calling with the
size of the canvas before you start drawing. Next, we clear the canvas in
preparation for drawing on it:

```js
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
```

…and then:

```js
mat4.perspective(
	 45,
	gl.viewportWidth / gl.viewportHeight,
	0.1,
	100.0,
	pMatrix
)
```

Here we’re setting up the perspective with which we want to view the scene.  By
default, WebGL will draw things that are close by the same size as things that
are far away (a style of 3D known as orthographic projection).  In order to make
things that are further away look smaller, we need to tell it a little about the
perspective we’re using.  For this scene, we’re saying that our (vertical) field
of view is 45°, we’re telling it about the width-to-height ratio of our canvas,
and saying that we don’t want to see things that are closer than 0.1 units to
our viewpoint, and that we don’t want to see things that are further away than
100 units.

As you can see, this perspective stuff is using a function from a module called
mat4, and involves an intriguingly-named variable called pMatrix. More about
these later hopefully for now it is clear how to use them without needing to
know the details.

Now that we have our perspective set up, we can move on to drawing some stuff:

```js
 mat4.identity(mvMatrix)
```

The first step is to "move" to the centre of the 3D scene.  In OpenGL, when
you’re drawing a scene, you tell it to draw each thing you draw at a "current"
position with a "current" rotation — so, for example, you say "move 20 units
forward, rotate 32 degrees, then draw the robot", the last bit being some
complex set of "move this much, rotate a bit, draw that" instructions in itself.
This is useful because you can encapsulate the "draw the robot" code in one
function, and then easily move said robot around just by changing the
move/rotate stuff you do before calling that function.

The current position and current rotation are both held in a matrix as you
probably learned at school, matrices can represent translations (moves from
place to place), rotations, and other geometrical transformations.  For reasons
I won’t go into right now, you can use a single 4×4 matrix (not 3×3) to
represent any number of transformations in 3D space you start with the identity
matrix — that is, the matrix that represents a transformation that does nothing
at all — then multiply it by the matrix that represents your first
transformation, then by the one that represents your second transformation, and
so on.   The combined matrix represents all of your transformations in one. The
matrix we use to represent this current move/rotate state is called the
model-view matrix, and by now you have probably worked out that the variable
mvMatrix holds our model-view matrix, and the mat4.identity function that we
just called sets it to the identity matrix so that we’re ready to start
multiplying translations and rotations into it.  Or, in other words, it’s moved
us to an origin point from which we can move to start drawing our 3D world.

Sharp-eyed readers will have noticed that at the start of this discussion of
matrices I said "in OpenGL", not "in WebGL".  This is because WebGL doesn’t have
this stuff built in to the graphics library. Instead, we use a third-party
matrix library — Brandon Jones’s excellent glMatrix — plus some nifty WebGL
tricks to get the same effect. More about that niftiness later.

Right, let’s move on to the code that draws the triangle on the left-hand side
of our canvas.

```js
 mat4.translate(mvMatrix, [-1.5, 0.0, -7.0])
```

Having moved to the centre
of our 3D space with by setting mvMatrix to the identity matrix, we start the
triangle  by moving 1.5 units to the left (that is, in the negative sense along
the X axis), and seven units into the scene (that is, away from the viewer the
negative sense along the Z axis).  (mat4.translate, as you might guess, means
"multiply the given matrix by a translation matrix with the following
parameters".)

The next step is to actually start drawing something!

```js
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
```

So, you
remember that in order to use one of our buffers, we call gl.bindBuffer to
specify a current buffer, and then call the code that operates on it. Here we’re
selecting our triangleVertexPositionBuffer, then telling WebGL that the values
in it should be used for vertex positions. I’ll explain a little more about how
that works later for now, you can see that we’re using the itemSize property we
set on the buffer to tell WebGL that each item in the buffer is three numbers
long.

Next, we have:

```js
setMatrixUniforms()
```

This tells WebGL to take account of our current
model-view matrix (and also the projection matrix, about which more later).
This is required because all of this matrix stuff isn’t built in to WebGL.  The
way to look at it is that you can do all of the moving around by changing the
mvMatrix variable you want, but this all happens in JavaScript’s private space.
setMatrixUniforms, a function that’s defined further up in this file, moves it
over to the graphics card.

Once this is done, WebGL has an array of numbers that it knows should be treated
as vertex positions, and it knows about our matrices.   The next step tells it
what to do with them:

```js
gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems)
```

Or, put another way, "draw the array of vertices I gave you earlier as
triangles, starting with item 0 in the array and going up to the numItemsth
element".

Once this is done, WebGL will have drawn our triangle.   Next step, draw the
square:

```js
mat4.translate(mvMatrix, [3.0, 0.0, 0.0])
```

We start by moving our
model-view matrix three units to the right.  Remember, we’re currently already
1.5 to the left and 7 away from the screen, so this leaves us 1.5 to the right
and 7 away.  Next:

```js
gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
```

So, we tell
WebGL to use our square’s buffer for its vertex positions…

```js
setMatrixUniforms()
```

…we push over the model-view and projection matrices
again (so that we take account of that last mvTranslate), which means that we
can finally:

```
 gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems)
```

Draw the points.  What, you may ask, is a triangle strip?  Well, it’s a strip of
triangles :-)   More usefully, it’s a strip of triangles where the first three
vertices you give specify the first triangle, then the last two of those
vertices plus the next one specify the next triangle, and so on.  In this case,
it’s a quick-and-dirty way of specifying a square.  In more complex cases, it
can be a really useful way of specifying a complex surface in terms of the
triangles that approximate it.

Anyway, once that’s done, we’ve finished our drawScene function.

If you’ve got this far, you’re definitely ready to start experimenting.
Copy the code to a local file, either from GitHub or directly from the live
version if you do the latter, you need index.html and glMatrix-0.9.5.min.js.
Run it up locally to make sure it works, then try changing some of the vertex
positions above in particular, the scene right now is pretty flat try changing
the Z values for the square to 2, or -3, and see it get larger or smaller as
it moves back and forward.  Or try changing just one or two of them, and watch
it distort in perspective.  Go crazy, and don’t mind me.  I’ll wait.


Right, now that you’re back, let’s take a look at the support functions that
made all of the code we just went over possible. As I said before, if you’re
happy to ignore the details and just copy and paste the support functions that
come above initBuffers in the page, you can probably get away with it and build
interesting WebGL pages (albeit in black and white — colour’s the next lesson).
But none of the details are difficult to understand, and by understanding how
this stuff works you’re likely to write better WebGL code later on.

Still with me?  Thanks :-)   Let’s get the most boring of the functions out of
the way first the first one called by webGLStart, which is initGL.  It’s near
the top of the web page, and here’s a copy for reference:

```js
var gl

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl")
		gl.viewportWidth = canvas.width
		gl.viewportHeight = canvas.height
	}
	catch (error) {}

	if (!gl) {
		alert("Could not initialize WebGL!")
	}
}
```

This is very simple. As you may have
noticed, the initBuffers and drawScene functions frequently referred to an
object called gl, which clearly referred to some kind of core WebGL "thing".
This function gets that "thing", which is called a WebGL context, and does it by
asking the canvas it is given for the context, using a standard context name.
(As you can probably guess, at some point the context name will change from
"experimental-webgl" to "webgl" I’ll update this lesson and blog about it when
that happens. Subscribe to the RSS feed if you want to know about that — and,
indeed, if you want at-least-weekly WebGL news.) Once we’ve got the context, we
again use JavaScript’s willingness to allow us to set any property we like on
any object to store on it the width and height of the canvas to which it relates
this is so that we can use it in the code that sets up the viewport and the
perspective at the start of drawScene. Once that’s done, our GL context is set
up.

After calling initGL, webGLStart called initShaders. This, of course,
initialises the shaders (duh -) .  We’ll come back to that one later, because
first we should take a look at our model-view matrix, and the projection matrix
I also mentioned earlier.  Here’s the code:

```js
var mvMatrix = mat4.create()   var pMatrix = mat4.create()
```

So, we
define a variable called mvMatrix to hold the model-view matrix and one called
pMatrix for the projection matrix, and then set them to empty (all-zero)
matrices to start off with. It’s worth saying a bit more about the projection
matrix here. As you will remember, we applied the glMatrix function
mat4.perspective to this variable to set up our perspective, right at the start
of drawScene. This was because WebGL does not directly support perspective, just
like it doesn’t directly support a model-view matrix.  But just like the process
of moving things around and rotating them that is encapsulated in the model-view
matrix, the process of making things that are far away look proportionally
smaller than things close up is the kind of thing that matrices are really good
at representing.  And, as you’ve doubtless guessed by now, the projection matrix
is the one that does just that.  The mat4.perspective function, with its aspect
ratio and field-of-view, populated the matrix with the values that gave use the
kind of perspective we wanted.

Right, now we’ve been through everything apart from the setMatrixUniforms
function, which, as I said earlier, moves the model-view and projection matrices
up from JavaScript to WebGL, and the scary shader-related stuff.  They’re
inter-related, so let’s start with some background.

Now, what is a shader, you may ask?  Well, at some point in the history of 3D
graphics they may well have been what they sound like they might be — bits of
code that tell the system how to shade, or colour, parts of a scene before it is
drawn.  However, over time they have grown in scope, to the extent that they can
now be better defined as bits of code that can do absolutely anything they want
to bits of the scene before it’s drawn.  And this is actually pretty useful,
because (a) they run on the graphics card, so they do what they do really
quickly and (b) the kind of transformations they can do can be really convenient
even in simple examples like this.

The reason that we’re introducing shaders in what is meant to be a simple WebGL
example (they’re at least "intermediate" in OpenGL tutorials) is that we use
them to get the WebGL system, hopefully running on the graphics card, to apply
our model-view matrix and our projection matrix to our scene without us having
to move around every point and every vertex in (relatively) slow JavaScript.
This is incredibly useful, and worth the extra overhead.

So, here’s how they are set up.  As you will remember, webGLStart called
initShaders, so let’s go through that step-by-step:

```js
var shaderProgram

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs")
	var vertexShader = getShader(gl, "shader-vs")
	shaderProgram = gl.createProgram()
	gl.attachShader(shaderProgram, vertexShader)
	gl.attachShader(shaderProgram, fragmentShader)
	gl.linkProgram(shaderProgram)

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	alert("Could not initialize shaders!")
}

gl.useProgram(shaderProgram)
```

As you can see, it uses a function called
getShader to get two things,  a "fragment shader" and a "vertex shader", and
then attaches them both to a WebGL thing called a "program".  A program is a bit
of code that lives on the WebGL side of the system you can look at it as a way
of specifying something that can run on the graphics card.  As you would expect,
you can associate with it a number of shaders, each of which you can see as a
snippet of code within that program specifically, each program can hold one
fragment and one vertex shader. We’ll look at them shortly.

```js
shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
	shaderProgram,
	"aVertexPosition"
)
gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
```

Once the function has set up the program and attached the shaders, it gets a
reference to an "attribute", which it stores in a new field on the program
object called vertexPositionAttribute. Once again we’re taking advantage of
JavaScript’s willingness to set any field on any object program objects don’t
have a vertexPositionAttribute field by default, but it’s convenient for us to
keep the two values together, so we just make the attribute a new field of the
program.

So, what’s the vertexPositionAttribute for? As you may remember, we used it in
drawScene if you look now back at the code that set the triangle’s vertex
positions from the appropriate buffer, you’ll see that the stuff we did
associated the buffer with that attribute. You’ll see what that means in a
moment for now, let’s just note that we also use gl.enableVertexAttribArray to
tell WebGL that we will want to provide values for the attribute using an array.

```js
shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix") shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix")
}
```

The last thing initShaders does is get two more values from
the program, the locations of two things called uniform variables. We’ll
encounter them soon for now, you should just note that like the attribute, we
store them on the program object for convenience.

Now, let’s take a look at getShader:

```js
function getShader(gl, id) {
	var shaderScript = document.getElementById(id)

	if (!shaderScript) {
		return null
	}

	var str = ""
	var k = shaderScript.firstChild

	while (k) {
		if (k.nodeType === 3)
			str += k.textContent
		k = k.nextSibling
	}

	var shader
	if (shaderScript.type == "x-shader/x-fragment") {
		shader =
			gl.createShader(gl.FRAGMENT_SHADER)
	}
	else if (shaderScript.type === "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER)
	}
	else {
		return null
	}

	gl.shaderSource(shader, str) gl.compileShader(shader)

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader))
		return null
	}

	return shader
}
```

This is another one of those functions that is much simpler than it looks.
All we’re doing here is looking for an element in our
HTML page that has an ID that matches a parameter passed in, pulling out its
contents, creating either a fragment or a vertex shader based on its type
(more about the difference between those in a future lesson) and then passing
it off to WebGL to be compiled into a form that can run on the graphics card.
The code then handles any errors, and it’s done! Of course, we could just
define shaders as strings within our JavaScript code and not mess around with
extracting them from the HTML — but by doing it this way, we make them much
easier to read, because they are defined as scripts in the web page, just as
if they were JavaScript themselves.

Having seen this, we should take a look at the shaders’ code:

```html
<script id="shader-fs" type="x-shader/x-fragment">
	precision mediump float;

	void main(void) {
		gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
</script>

<script id="shader-vs" type="x-shader/x-vertex">
	attribute vec3;
	aVertexPosition;

	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;

	void main(void) {
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	}
</script>
```

The first thing to remember about these is that they are not written in
JavaScript, even though the ancestry of the language is clearly similar.  In
fact, they’re written in a special shader language — called GLSL — that owes a
lot to C (as, of course, does JavaScript).

The first of the two, the fragment shader, does pretty much nothing it has a bit
of obligatory boilerplate code to tell the graphics card how precise we want it
to be with floating-point numbers (medium precision is good because it’s
required to be supported by all WebGL devices — highp for high precision doesn’t
work on all mobile devices), then simply specifies that everything that is drawn
will be drawn in white.  (How to do stuff in colour is the subject of the next
lesson.)

The second shader is a little more interesting.
It’s a vertex shader — which,
you’ll remember, means that it’s a bit of graphics-card code that can do pretty
much anything it wants with a vertex.  Associated with it, it has two uniform
variables called uMVMatrix and uPMatrix.
Uniform variables are useful because
they can be accessed from outside the shader — indeed, from outside its
containing program, as you can probably remember from when we extracted their
location in initShaders, and from the code we’ll look at next, where (as I’m
sure you’ve realised) we set them to the values of the model-view and the
projection matrices.
You might want to think of the shader’s program as an
object (in the object-oriented sense) and the uniform variables as fields.

Now, the shader is called for every vertex, and the vertex is passed in to the
shader code as aVertexPosition, thanks to the use of the vertexPositionAttribute
in the drawScene, when we associated the attribute with the buffer.
The tiny
bit of code in the shader’s main routine just multiplies the vertex’s position
by the model-view and the projection matrices, and pushes out the result as the
final position of the vertex.

So, webGLStart called initShaders, which used getShader to load the fragment and
the vertex shaders from scripts in the web page, so that they could be compiled
and passed over to WebGL and used later when rendering our 3D scene.

After all that, the only remaining unexplained code is setMatrixUniforms, which
is easy to understand once you know everything above :-)

```js
function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix)
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix)
}
```

So, using the references to the uniforms that represent our projection matrix
and our model-view matrix that we got back in initShaders, we send WebGL the
values from our JavaScript-style matrices.

Phew!  That was quite a lot for a first lesson, but hopefully now you (and I)
understand all of the groundwork we’re going to need to start building something
more interesting — colourful, moving, properly three-dimensional WebGL models.
