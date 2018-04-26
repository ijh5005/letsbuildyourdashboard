"use strict";

var app = angular.module('app', []);

app.controller('ctrl', ['$rootScope', '$scope', '$interval', '$timeout', '$http', 'task', 'appData', function($rootScope, $scope, $interval, $timeout, $http, task, appData){
  //database name
  $rootScope.db = 'letsbuildyourwebsitedashboard';
  //database collection name
  $rootScope.coll = 'dashboardContent';
  //api key
  $rootScope.apiKey = '7sJF23PwcfBVjIeJCuUDIXcWr3kJgx3d';
  //the id of the content in the collection
  $rootScope.id = '5ae13651f36d284005fe9064';
  //the app content will be retrieved with a get request to mlab and stored in $rootScope.appContent
  $rootScope.appContent;
  //dashboard options on the left of page
  $rootScope.leftDashboardOptions = [];
  //dashboard options on the right of page
  $rootScope.middleDashboardOptions = [];

  //active clicks
  $scope.selectServiceOption = (index) => {
    ($scope.currentNavOptionIndex === index) ? task.selectServiceOption(index, false) : task.selectServiceOption(index, true);
    $scope.currentNavOptionIndex = ($scope.currentNavOptionIndex === index) ? '' : index;
  }
  $scope.selectPageToEdit = (index) => {
    task.selectPageToEdit(index);
  }
  //back button
  $scope.goBack = () => {
    task.selectServiceOption(null, false);
    $scope.currentNavOptionIndex = '';
  }



  $scope.helpText = 'CHOOSE FROM THE ABOVE OPTIONS';
  $scope.navOptions = appData.navOptions;
  $scope.currentNavOptionIndex;

  //api calls
  $scope.get = () => {
    task.get();
  }
  $scope.post = () => {
    task.post();
  }
  $scope.update = () => {
    task.update();
  }
  $scope.del = () => {
    task.del();
  }

  const data = JSON.stringify(task.dataStructor);
  //get application data
  task.get();
}])

app.service('task', function($rootScope, $http){
  //service options
  this.selectServiceOption = (index, isSelected) => {
    //remove the active class from the navigation options
    $('.navBox').removeClass('activeNav');
    //remove the options
    $rootScope.leftDashboardOptions = [];
    if(isSelected){
      //show back btn
      $('#backBtn').removeClass('hideBackBtn');
      //add the active class to the select navigation option
      $(`.navBox[data="${index}"]`).addClass('activeNav');
      //show corresponding options
      switch (index) {
        case 0: this.setEditPageText(); break;
        default:
      }
    } else {
      //hide back btn
      $('#backBtn').addClass('hideBackBtn');
    }
  }
  this.setEditPageText = () => {
    const l = Object.keys($rootScope.appContent['pages']).length;
    for(let i = 0; i < l; i++){
      $rootScope.leftDashboardOptions.push($rootScope.appContent['pages'][`_${i}`]['name']);
    }
  }
  this.selectPageToEdit = (index) => {
    $rootScope.leftDashboardOptions = [];
    const content = $rootScope.appContent['pages'][`_${index}`]['content'];
    content.map(data => {
      $rootScope.leftDashboardOptions.push(data);
    })
  }

  //api calls
  this.get = () => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}?apiKey=${$rootScope.apiKey}`;
    $http({
      method: 'GET',
      url: url,
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      $rootScope.appContent = success['data'][0];
      console.log("ok");
    }

    const errorCallback = () => {
      console.log("error");
    }
  }
  this.post = () => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}?apiKey=${$rootScope.apiKey}`;
    const data = { hey: 'hi' };
    $http({
      method: 'POST',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("ok");
    }

    const errorCallback = () => {
      console.log("error");
    }
  }
  this.update = (id) => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}?apiKey=${$rootScope.apiKey}&_id=${id}`;
    const data = { hey: 'hi' };
    $http({
      method: 'PUT',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("ok");
    }

    const errorCallback = () => {
      console.log("error");
    }
  }
  this.del = (id) => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}/${id}?apiKey=${$rootScope.apiKey}`;
    const data = { hey: 'hi' };
    $http({
      method: 'DELETE',
      url: url,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    }).then(
        (success) => { successCallback(success) },
        (error) => { errorCallback(error.data) }
      );

    const successCallback = (success) => {
      console.log("ok");
    }

    const errorCallback = () => {
      console.log("error");
    }
  }

  this.dataStructor = {
    pages: {
      _0: {
        name: 'home',
        content: [
          "you've thought up a website to serve business needs... you've written details outlining its content, purpose, and audience... you've done enough... now let me build it."
        ]
      },
      _1: {
        name: 'service',
        content: [
          {
            header: "MULTI-DEVICE",
            subText: "Your website will look great on all devices: Desktop, Laptop, Tablet, and even TV.",
            body: "We use countless device types to surf the web. A three-second look at a website from any one of those devices will mean the difference between a customer deciding to stay on your site to explore or leave without even giving you a chance. The solution is to have a great looking site for any device type. With my services, your site will look amazing on all devices."
          },
          {
            header: "INTEGRATION",
            subText: "We can always add more features later. No pressure to get it all at once.",
            body: "There are several services you can get on your website: a login in page, shopping cart, email notification sign up, subscription sign up, and many more. No need to worrying about everything you need at once. Services can always be added later. For now, focus on what is most important for your customers. When you get more feedback or a better idea what your customer wants on your website we will add it as we go."
          },
          {
            header: "INEXPENSIVE",
            subText: "Websites can cost thousands. No fear, I'm here, with affordable prices.",
            body: "A web developer makes anywhere from $15 - $60/hr ( sometimes more! ). Websites can take weeks to finish depending on the complexity of the site so it gets expensive quick. I understand how it feels to inherit the stress and expenses of a business. So, let me remedy that expense by offering you a huge discount. Check out the pricing table below for details."
          }
        ]
      },
      _2: {
        name: 'cost',
        content: [
          {
            service: "website pages",
            description: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added.",
            price: "$50 each"
          },
          {
            service: "dashboard",
            description: "With the dashboard, you can edit content on your website, edit existing product information, and add additional products at the click of a button. This is a computer application.",
            price: "$10 / month"
          },
          {
            service: "shopping cart",
            description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more.",
            price: "$80"
          },
          {
            service: "device friendly layout",
            description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions.",
            price: "$25 each"
          },
          {
            service: "sign in/sign up",
            description: "Includes a sign in/sign up forms page linked to a database that stores usernames and passwords.",
            price: "$50"
          },
          {
            service: "email notifications",
            description: "An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website.",
            price: "$50"
          },
          {
            service: "text notifications",
            description: "An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website.",
            price: "$50"
          },
          {
            service: "page animations",
            description: "Custom animation to help your website stand out and build a smooth customer experience.",
            price: "$50"
          },
          {
            service: "contact form",
            description: "This form is a convenient way for customers to contact you. This form will be on a page of your website.",
            price: "$25"
          },
          {
            service: "feedback form",
            description: "This form is a convenient way for customers to leave feedback. This form will be on a page of your website.",
            price: "$25"
          }
        ]
      },
      _3: {
        name: 'tips',
        content: [
          {
            header: "EMAIL CUSTOMERS",
            subText: "Send emails promoting this week's sales.",
            body: ""
          },
          {
            header: "TEXT CUSTOMERS",
            subText: "Text appointment reminders and daily sales.",
            body: "The following forms are linked to my email and cell phone. Try sending me a message with your name, contact, questions, and comments. I will get back to you as soon as I can!"
          }
        ]
      },
      _4: {
        name: 'contact',
        content: []
      }
    },
    products: {
      _0: [
        {
          service: "website pages",
          description: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added.",
          price: "$50 each"
        },
        {
          service: "dashboard",
          description: "With the dashboard, you can edit content on your website, edit existing product information, and add additional products at the click of a button. This is a computer application.",
          price: "$10 / month"
        },
        {
          service: "shopping cart",
          description: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more.",
          price: "$80"
        },
        {
          service: "device friendly layout",
          description: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions.",
          price: "$25 each"
        },
        {
          service: "sign in/sign up",
          description: "Includes a sign in/sign up forms page linked to a database that stores usernames and passwords.",
          price: "$50"
        },
        {
          service: "email notifications",
          description: "An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website.",
          price: "$50"
        },
        {
          service: "text notifications",
          description: "An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website.",
          price: "$50"
        },
        {
          service: "page animations",
          description: "Custom animation to help your website stand out and build a smooth customer experience.",
          price: "$50"
        },
        {
          service: "contact form",
          description: "This form is a convenient way for customers to contact you. This form will be on a page of your website.",
          price: "$25"
        },
        {
          service: "feedback form",
          description: "This form is a convenient way for customers to leave feedback. This form will be on a page of your website.",
          price: "$25"
        }
      ]
    }
  }
});

app.service('appData', function(){
  this.navOptions = [
    {name: 'EDIT PAGE TEXT', icon: 'fas fa-align-left'},
    {name: 'REPORT BUG', icon: 'fas fa-bug'},
    {name: 'CONTACT DEVELOPER', icon: 'fas fa-envelope'},
    {name: 'ADD PRODUCTS', icon: 'fas fa-plus'},
    {name: 'FEATURE IDEAS', icon: 'fas fa-lightbulb'}
  ]
})

app.filter('shorten', function() {
  return function(input) {
    let output = '';
    const type = typeof input;
    if(type === 'string'){
      output = (input.length < 20) ? input : `${input.substring(0, 20)}...`;
    } else if(type === 'object'){
      const objKeys = Object.keys(input);
      objKeys.map(key => {
        const string = (input[key].length < 10) ? input[key] : `${input[key].substring(0, 10)}...`;
        output += string;
      })
    }
    return output;
  }
});
