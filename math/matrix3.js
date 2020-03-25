/*
 * An object representing a 3x3 matrix
 */

var Matrix3 = function () {

	if (!(this instanceof Matrix3)) {
		alert("Matrix3 constructor must be called with the new operator");
	}

	// Stores a matrix in a flat array - left to right, top to bottom.
	// This format will be similar to what we'll eventually need to provide the WebGL API
	this.elements = new Float32Array(9);

	// todo
	// "this.elements" should be initialized with values equal to the identity matrix
	for(var i = 0; i < 9; ++i)
	{
		if(i % 3 == Math.floor(i/3)) {
			this.elements[i] = 1;
		}
		else {
			this.elements[i] = 0;
		}
	}

	// -------------------------------------------------------------------------
	this.clone = function() {
		// create a new Matrix3 instance that is an exact copy of 'this' one and return it
		var copy = new Matrix3();
		for(var index = 0; index < this.elements.length; index++)
		{
			copy.elements[index] = this.elements[index];
		}
		return copy;
	};

	// -------------------------------------------------------------------------
	this.copy = function(other) {
		// copy all of the elements of other into the elements of 'this' matrix
		for(var index = 0; index < other.elements.length; index++)
		{
			this.elements[index] = other.elements[index];
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.set = function (e11, e12, e13, e21, e22, e23, e31, e32, e33) {
		// todo
		// Use the 9 elements passed in as arguments e-row#col# as the values to set on 'this' matrix.
		// Order is left to right, top to bottom.
		var passedSet = [e11, e12, e13, e21, e22, e23, e31, e32, e33];
		for(var i = 0; i < 9; i++) {
			this.elements[i] = passedSet[i];
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.getElement = function (row, col) {
		// todo
		// use the row and col to get the proper index into the 1d element array and return it
		var index = (row*3) + col;
		return this.elements[index];
	};

	// -------------------------------------------------------------------------
	this.setIdentity = function () {
		// todo
		// reset every element in 'this' matrix to make it the identity matrix
		for(var i = 0; i < 9; ++i)
		{
			if(i % 3 == Math.floor(i/3)) {
				this.elements[i] = 1;
			}
			else {
				this.elements[i] = 0;
			}
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationX = function (angle) {
		// ignore for now, you will implement this in matrix4
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationY = function (angle) {
		// ignore for now, you will implement this in matrix4
		return this;
	};


	// -------------------------------------------------------------------------
	this.setRotationZ = function (angle) {
		// ignore for now, you will implement this in matrix4
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyScalar = function (s) {
		for (var i = 0; i < 16; ++i) {
			this.elements[i] = this.elements[i] * s;
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyVector = function (v) {
		var result = new Vector3();
		// todo
		// set the result vector values to be the result of multiplying the argument
		// v by 'this' matrix
		var resultVector = [result.x, result.y, result.z];
		var passedVector = [v.x, v.y, v.z];
		var matrixIndex = 0;

		for(var row = 0; row < 3; row++)
		{
			for(var col = 0; col < 3; col++)
			{
				resultVector[row] += (this.elements[matrixIndex] * passedVector[col]);
				matrixIndex++;
			}
		}
		result.x = resultVector[0];
		result.y = resultVector[1];
		result.z = resultVector[2];
		return result;
	};

	// -------------------------------------------------------------------------
	this.multiplyRightSide = function (otherMatrixOnRight) {
		// todo
		// multiply 'this' matrix (on the left) by otherMatrixOnRight (on the right)
		// the results should be applied to the elements on 'this' matrix
		//video reference: https://www.youtube.com/watch?v=x7zua7fhyIw
		var result = new Float32Array(9);

		for(var i = 0; i < 3; i++)
		{
			for(var j = 0; j < 3; j++)
			{
				for(var k = 0; k < 3; k++)
				{
					result[i*3+j] += this.getElement(i, k) * otherMatrixOnRight.getElement(k, j);
				}
			}
		}
		this.elements = result;
		return this;
	};

	// -------------------------------------------------------------------------
	this.determinant = function () {
		// todo
		// compute and return the determinant for 'this' matrix
		//Note - produces a scalar value
		//Important to know because a 0 determinant means you cannot
		//compute the inverse
		var mE = this.elements; //mE means matrix Elements

		var determinant = (mE[0]*mE[4]*mE[8]) +
						(mE[1]*mE[5]*mE[6]) +
						(mE[2]*mE[3]*mE[7]) -
						(mE[2]*mE[4]*mE[6]) -
						(mE[1]*mE[3]*mE[8]) -
						(mE[0]*mE[5]*mE[7]) ;
		return determinant;
	};

	// -------------------------------------------------------------------------
	this.transpose = function () {
		// todo
		// modify 'this' matrix so that it becomes its transpose
		//Note - diagonal will stay the same as original matrix
		//turns rows into columns and columns into rows
		/*
			0 1 2			  0 3 6
			3 4 5	becomes	  1 4 7
			6 7 8			  2 5 8
		*/

		var transposed = this.clone();
		var tE = this.elements;

		tE[1] = transposed.elements[3];
		tE[3] = transposed.elements[1];
		tE[6] = transposed.elements[2];
		tE[2] = transposed.elements[6];
		tE[5] = transposed.elements[7];
		tE[7] = transposed.elements[5];

		return this;
	};

	// -------------------------------------------------------------------------
	this.inverse = function () {
		var FLOAT32_EPSILON = 1.1920928955078125e-7;
		var det = this.determinant();
		if(Math.abs(det) <= FLOAT32_EPSILON) {
			return setIdentity();
		} else {
			var e = this.elements;

			// laid out for clarity, not performance
			var m11 = e[0];   var m12 = e[1];   var m13 = e[2];
			var m21 = e[3];   var m22 = e[4];   var m23 = e[5];
			var m31 = e[6];   var m32 = e[7];   var m33 = e[8];

			var minor11 = m22 * m33 - m23 * m32;
			var minor12 = m21 * m33 - m23 * m31;
			var minor13 = m21 * m32 - m22 * m31;
			var minor21 = m12 * m33 - m13 * m32;
			var minor22 = m11 * m33 - m13 * m31;
			var minor23 = m11 * m32 - m12 * m31;
			var minor31 = m12 * m23 - m13 * m22;
			var minor32 = m11 * m33 - m13 * m31;
			var minor33 = m11 * m22 - m12 * m21;

			return this.set(
				minor11, -minor21, minor31,
				-minor12, minor22, -minor32,
				minor13, -minor23, minor33
			).multiplyScalar(1/det);
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.log = function () {
		var e = this.elements;
		console.log('[ ' +
			'\n ' + e[0] + ', ' + e[1] + ', ' + e[2] +
			'\n ' + e[4] + ', ' + e[5] + ', ' + e[6] +
			'\n ' + e[8] + ', ' + e[9] + ', ' + e[10] +
			'\n ' + e[12] + ', ' + e[13] + ', ' + e[14] +
			'\n]'
		);

		return this;
	};
};
