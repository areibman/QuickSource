'use strict';

(function() {
	// Posts Controller Spec
	describe('Posts Controller Tests', function() {
		// Initialize global variables
		var PostsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(module(function($urlRouterProvider) {
            $urlRouterProvider.deferIntercept();
        }));


        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Posts controller.
			PostsController = $controller('PostsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Post object fetched from XHR', inject(function(Posts) {
			// Create sample Post using the Posts service
			var samplePost = new Posts({
				name: 'New Post'
			});

			// Create a sample Posts array that includes the new Post
			var samplePosts = [samplePost];

			// Set GET response
			$httpBackend.expectGET('posts').respond(samplePosts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.posts).toEqualData(samplePosts);
		}));

/*
		it('$scope.findOne() should create an array with one Post object fetched from XHR using a postId URL parameter', inject(function(Posts) {
			// Define a sample Post object
			var samplePost = new Posts({
				name: 'New Post'
			});

			// Set the URL parameter
			$stateParams.postId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/posts\/([0-9a-fA-F]{24})$/).respond(samplePost);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.post).toEqualData(samplePost);
		}));
*/
		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Posts) {
			// Create a sample Post object
			var samplePostPostData = new Posts({
                title: 'New Post',
                zip:'10304'
			});

			// Create a sample Post response
            var samplePostResponse = new Posts({
                _id: '525cf20451979dea2c000001',
                title: 'New Post',
                zip:'10304'
            });


            // Fixture mock form input values
            scope._id = '525cf20451979dea2c000001',
            scope.title = 'New Post';
            scope.zip = '10304';
			// Set POST response
			//$httpBackend.whenPOST('/posts',samplePostPostData).respond(samplePostResponse);
            $httpBackend.expectPOST('/posts').respond(samplePostResponse);

            // Run controller functionality
			scope.create();
			$httpBackend.flush();

            //Scope fields aren't cleared the url is redirected though
			expect(scope.title).toEqual('New Post');
            expect(scope._id).toEqual('525cf20451979dea2c000001');


            // Test URL redirection after the Post was created
			expect($location.path()).toBe('/posts/' + samplePostResponse._id);
		}));

/*		it('$scope.update() should update a valid Post', inject(function(Posts) {
			// Define a sample Post put data
			var samplePostPutData = new Posts({
                _id: '525cf20451979dea2c000001',
                title: 'New Post',
                abstract:'Test Abstract',
                description:'Test Description',
                location:'10304'
			});

			// Mock Post in scope
			scope.post = samplePostPutData;

			// Set PUT response
			$httpBackend.expectPUT(/posts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/posts/' + samplePostPutData._id);
		}));*/
		it('$scope.remove() should send a DELETE request with a valid postId and remove the Post from the scope', inject(function(Posts) {
			// Create new Post object
			var samplePost = new Posts({
                id:0,
                _id: 0,
                isActive: true

			});

            var sampleResponse =  new Posts({
                id:0,
                _id:0,
                isActive:false
            });

			// Create new Posts array and include the Post
			scope.post = samplePost;

			// Set expected DELETE response
			$httpBackend.expectPUT('/posts/0/remove').respond(204);
			// Run controller functionality
            scope.remove();
            $httpBackend.flush();
			// Test array after successful delete
			expect(scope.post.isActive).toBe(false);
		}));
	});
}());
