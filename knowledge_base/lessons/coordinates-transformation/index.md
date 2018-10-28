

1. Modeling coordinates
	Local coordinates that describe the shape.

2. World coordinates
	Coordinates in the global coordinate system that contains all objects.

3. View coordinates
	Coordinates in the coordinate system that incorporates a virtual camera's view of the scene.

4. Viewport coordinates
	Coordinates are the coordinate system that describes the camera projection for the scene (orthographic or perspective) and fits the projected scene into screen space.
	This projects the scene from a 3D to a 2D representation that can be displayed on the screen.


Transformation matrices are used to perform the calculations from one coordinate system to another.
The transformation modeling -> world -> view coordinates is performed by the ´modelViewMatrix´, which combines two transformations into one matrix.
The´ perspectiveMatrix´ transforms from view coordinates to viewport coordinates.
