"use strict";

!(function () {

	var gl, triangleVertexPositionBuffer, squareVertexPositionBuffer, shaderProgram;

	function initWebGl() {
		var canvas = arguments[0] === undefined ? document.querySelector("canvas") : arguments[0];

		try {
			gl = canvas.getContext("webgl");
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} catch (error) {
			alert(error);
		}

		if (!gl) {
			alert("Could not initialise WebGL, sorry :-(");
		}
	}

	function initShaders() {

		var fragmentShader = "\n\t\t\t\tprecision mediump float;\n\n\t\t\t\tvoid main(void) {\n\t\t\t\t\tgl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\t\t\t\t}\n\t\t\t",
		    vertexShader = "\n\t\t\t\tattribute vec3 aVertexPosition;\n\t\t\t\tuniform mat4 uMVMatrix;\n\t\t\t\tuniform mat4 uPMatrix;\n\t            void main(void) {\n\t                gl_Position = uPMatrix * uMVMatrix *\n\t                    vec4(aVertexPosition, 1.0);\n\t            }\n\t\t\t";

		shaderProgram = gl.createProgram();

		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Could not initialise shaders");

		gl.useProgram(shaderProgram);
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	}

	function initBuffers() {

		var vertices;

		triangleVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

		vertices = [0, 1, 0, -1, -1, 0, 1, -1, 0];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		triangleVertexPositionBuffer.itemSize = 3;
		triangleVertexPositionBuffer.numItems = 3;

		squareVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);

		vertices = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		squareVertexPositionBuffer.itemSize = 3;
		squareVertexPositionBuffer.numItems = 4;
	}

	function drawScene() {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100, pMatrix);

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, [-1.5, 0, -7]);

		gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	}

	function lesson01() {

		initWebGl();
		initShaders();
		initBuffers();

		gl.clearColor(0, 0, 0, 1);
		gl.enable(gl.DEPTH_TEST);

		drawScene();
	}
})();
