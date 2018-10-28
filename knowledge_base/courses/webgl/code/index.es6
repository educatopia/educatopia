!function () {
	var gl,
		triangleVertexPositionBuffer,
		squareVertexPositionBuffer,
		shaderProgram


	function initWebGl (canvas = document.querySelector('canvas')) {
		try {
			gl = canvas.getContext("webgl")
			gl.viewportWidth = canvas.width
			gl.viewportHeight = canvas.height
		}
		catch (error) {
			alert(error)
		}

		if (!gl) {
			alert("Could not initialise WebGL, sorry :-(")
		}
	}

	function initShaders () {

		var fragmentShader = `
				precision mediump float;

				void main(void) {
					gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
				}
			`,
			vertexShader = `
				attribute vec3 aVertexPosition;
				uniform mat4 uMVMatrix;
				uniform mat4 uPMatrix;
	            void main(void) {
	                gl_Position = uPMatrix * uMVMatrix *
	                    vec4(aVertexPosition, 1.0);
	            }
			`

		shaderProgram = gl.createProgram()

		gl.attachShader(shaderProgram, vertexShader)
		gl.attachShader(shaderProgram, fragmentShader)
		gl.linkProgram(shaderProgram)

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
			alert("Could not initialise shaders")

		gl.useProgram(shaderProgram)
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
			shaderProgram,
			"aVertexPosition"
		)
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)
		shaderProgram.pMatrixUniform = gl.getUniformLocation(
			shaderProgram,
			"uPMatrix"
		)
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(
			shaderProgram,
			"uMVMatrix"
		)
	}

	function initBuffers () {

		var vertices


		triangleVertexPositionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)

		vertices = [
			0, 1, 0,
			-1, -1, 0,
			1, -1, 0
		]

		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(vertices),
			gl.STATIC_DRAW
		)

		triangleVertexPositionBuffer.itemSize = 3
		triangleVertexPositionBuffer.numItems = 3


		squareVertexPositionBuffer = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer)

		vertices = [
			1, 1, 0,
			-1, 1, 0,
			1, -1, 0,
			-1, -1, 0
		]

		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(vertices),
			gl.STATIC_DRAW
		)

		squareVertexPositionBuffer.itemSize = 3
		squareVertexPositionBuffer.numItems = 4
	}


	function drawScene () {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

		mat4.perspective(
			45,
			gl.viewportWidth / gl.viewportHeight,
			0.1,
			100,
			pMatrix
		)

		mat4.identity(mvMatrix)
		mat4.translate(mvMatrix, [-1.5, 0.0, -7.0])

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer)
		gl.vertexAttribPointer(
			shaderProgram.vertexPositionAttribute,
			triangleVertexPositionBuffer.itemSize,
			gl.FLOAT,
			false,
			0,
			0
		)
	}

	function lesson01 () {

		initWebGl()
		initShaders()
		initBuffers()

		gl.clearColor(0, 0, 0, 1)
		gl.enable(gl.DEPTH_TEST)

		drawScene()
	}

}()
