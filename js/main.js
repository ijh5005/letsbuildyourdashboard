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
  $rootScope.id = '5ae47beef36d282906c3334c';
  //the app content will be retrieved with a get request to mlab and stored in $rootScope.appContent
  $rootScope.appContent;
  //dashboard options on the left of page
  $rootScope.leftDashboardOptions = [];
  //dashboard options on the right of page
  $rootScope.middleDashboardOptions = [];
  //content being edited
  $rootScope.editContent = '';
  //toggle input box
  $rootScope.toggleInputBox = false;
  $rootScope.pageIndex = '';
  $rootScope.objIndex = null;
  $rootScope.innerIndex = '';
  //the help text on the screen
  $rootScope.helpText = '';
  //submit button text
  $rootScope.submit = 'UPDATE';

  //  VARIABLES **********
  //store the navigation options
  $scope.navOptions = appData.navOptions;
  // current navigation option index chosen
  $scope.currentNavOptionIndex;

  //  METHODS **********
  //select and nav option
  $scope.selectServiceOption = (index) => {
    //reset $rootScope.objIndex
    $rootScope.objIndex = null;
    $rootScope.innerIndex = '';
    //hide middleDashboardOptions
    $rootScope.middleDashboardOptions = [];
    //hide input box
    $rootScope.toggleInputBox = false;
    ($scope.currentNavOptionIndex === index) ? task.selectServiceOption(index, false) : task.selectServiceOption(index, true);
    $scope.currentNavOptionIndex = ($scope.currentNavOptionIndex === index) ? '' : index;
  }
  //choice page to edit content
  $scope.selectPageToEdit = (index) => {
    $rootScope.toggleInputBox = false;
    task.selectPageToEdit(index);
  }
  //select the content to edit
  $scope.selectContent = (index) => {
    task.selectContent(index);
  }
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
  //confirmation for updating text
  $scope.confirmation = (answer) => {
    task.confirmation(answer);
  }
  //update button click
  $scope.updateContent = () => {
    task.updateContent();
  }

  //send emails
  $scope.sendEmail = () => {
    task.sendEmail();
  }

  //log in
  $scope.logIn = () => {
    task.logIn();
  }

  //data to copy from when storing the data in mlab
  const data = JSON.stringify(task.dataStructor);
  //get application data
  task.get();
  task.changeHelpText('initialText');
}])

app.service('task', function($rootScope, $http, $timeout, appData){
  //log in
  this.logIn = () => {
    $('#logIn').fadeOut();
  }

  //service options
  this.selectServiceOption = (index, isSelected) => {
    //remove the active class from the navigation options
    $('.navBox').removeClass('activeNav');
    //remove the options
    $rootScope.leftDashboardOptions = [];
    if(isSelected){
      //show back btn
      $('#backBtn').removeClass('pageChoice');
      //add the active class to the select navigation option
      $(`.navBox[data="${index}"]`).addClass('activeNav');
      //show corresponding options
      switch (index) {
        case 0: this.setEditPageText(); break;
        case 1: this.reportBug(); break;
        case 2: this.contactDeveloper(); break;
        case 3: this.addProducts(); break;
        case 4: this.addIdea(); break;
        default:
      }
    } else {
      //hide back btn
      $('#backBtn').addClass('hideBackBtn');
      this.changeHelpText('initialText');
    }
  }
  this.setEditPageText = () => {
    $rootScope.submit = 'UPDATE';
    $rootScope.disableInputFill = false;
    this.changeHelpText('pageChoice');
    const l = Object.keys($rootScope.appContent['pages']).length;
    for(let i = 0; i < l; i++){
      $rootScope.leftDashboardOptions.push($rootScope.appContent['pages'][`_${i}`]['name']);
    }
  }
  this.reportBug = () => {
    this.showInputBox();
    $timeout(() => {
      $rootScope.submit = 'SEND';
      $rootScope.middleDashboardOptions = [];
      this.changeHelpText('bugFix');
      $rootScope.disableInputFill = true;
      $rootScope.middleDashboardOptions.push(appData['helpText']['bugFix']);
    })

  }
  this.contactDeveloper = () => {
    this.showInputBox();
    $timeout(() => {
      $rootScope.submit = 'SEND';
      $rootScope.middleDashboardOptions = [];
      this.changeHelpText('contact');
      $rootScope.disableInputFill = true;
      $rootScope.middleDashboardOptions.push(appData['helpText']['contact']);
    })
  }
  this.addProducts = () => {
    $timeout(() => {
      $rootScope.submit = 'SEND';
      $rootScope.middleDashboardOptions = [];
      this.changeHelpText('comingSoon');
      $rootScope.disableInputFill = true;
      $rootScope.middleDashboardOptions.push(appData['helpText']['comingSoon']);
    })
  }
  this.addIdea = () => {
    this.showInputBox();
    $timeout(() => {
      $rootScope.middleDashboardOptions = [];
      this.changeHelpText('ideas');
      $rootScope.middleDashboardOptions.push(appData['helpText']['ideas']);
      $rootScope.disableInputFill = true;
    })
  }
  this.showInputBox = () => {
    $timeout(() => {
      $rootScope.toggleInputBox = true;
    })
  }
  this.selectPageToEdit = (index) => {
    this.changeHelpText('contentChoice');
    //reset $rootScope.objIndex
    $rootScope.objIndex = null;
    $rootScope.innerIndex = '';
    //set page index
    $rootScope.pageIndex = index;
    //set the content to be displayed in the middle section
    $rootScope.editContent = $rootScope.appContent['pages'][`_${index}`]['content'];
    $timeout(() => {
      //clear the middle section of any page content
      $rootScope.middleDashboardOptions = [];
      $timeout(() => {
        //loop through the content to append in the middle section
        $rootScope.editContent.map(data => {
          $rootScope.middleDashboardOptions.push(data);
        })
      })
    })
  }
  this.selectContent = (index) => {
    if(typeof $rootScope.middleDashboardOptions[index] === 'string'){
      if(!$rootScope.disableInputFill){
        this.changeHelpText('changeText');
        this.showInputBox();
        $timeout(() => {
          $('#editTextInput').val($rootScope.middleDashboardOptions[index]);
          if($rootScope.objIndex !== null){
            $rootScope.innerIndex = index;
          }
        }, 10)
      }
    } else if (typeof $rootScope.middleDashboardOptions[index] === 'object') {
      //set $rootScope.objIndex
      $rootScope.objIndex = index;
      let newEditContent = [];
      const objKeys = Object.keys($rootScope.middleDashboardOptions[index]);
      objKeys.map((data) => {
        newEditContent.push($rootScope.middleDashboardOptions[index][data]);
      });
      $timeout(() => {
        $rootScope.middleDashboardOptions = [];
        $timeout(() => {
          $rootScope.middleDashboardOptions = newEditContent;
        })
      })
    }
  }
  this.confirmation = (answer) => {
    //hide confirmation screen
    $('#confirmationBoxContainer').css('zIndex', -1).css('opacity', 0);
    if(answer === 'yes'){
      //input text
      const textToChange = $('#editTextInput').val();
      if($rootScope.objIndex !== null){
        $rootScope.appContent['pages'][`_${$rootScope.pageIndex}`]['content'][$rootScope.objIndex][`_${$rootScope.innerIndex}`] = textToChange;
        this.update($rootScope.id, $rootScope.appContent);
      } else {
        $rootScope.appContent['pages'][`_${$rootScope.pageIndex}`]['content'][0] = textToChange;
        this.update($rootScope.id, $rootScope.appContent);
      }
    }
  }
  this.updateContent = () => {
    //show confirmation box
    $('#confirmationBoxContainer').css('zIndex', 4).css('opacity', 1);
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
      console.log("data fitched");
    }

    const errorCallback = () => {
      console.log("error in fitching data");
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
  this.update = (id, data) => {
    const url = `https://api.mlab.com/api/1/databases/${$rootScope.db}/collections/${$rootScope.db}?apiKey=${$rootScope.apiKey}&_id=${id}`;
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
      console.log("updated data");
    }

    const errorCallback = () => {
      console.log("error when updating data");
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
            _0: "MULTI-DEVICE",
            _1: "Your website will look great on all devices: Desktop, Laptop, Tablet, and even TV.",
            _2: "We use countless device types to surf the web. A three-second look at a website from any one of those devices will mean the difference between a customer deciding to stay on your site to explore or leave without even giving you a chance. The solution is to have a great looking site for any device type. With my services, your site will look amazing on all devices."
          },
          {
            _0: "INTEGRATION",
            _1: "We can always add more features later. No pressure to get it all at once.",
            _2: "There are several services you can get on your website: a login in page, shopping cart, email notification sign up, subscription sign up, and many more. No need to worrying about everything you need at once. Services can always be added later. For now, focus on what is most important for your customers. When you get more feedback or a better idea what your customer wants on your website we will add it as we go."
          },
          {
            _0: "INEXPENSIVE",
            _1: "Websites can cost thousands. No fear, I'm here, with affordable prices.",
            _2: "A web developer makes anywhere from $15 - $60/hr ( sometimes more! ). Websites can take weeks to finish depending on the complexity of the site so it gets expensive quick. I understand how it feels to inherit the stress and expenses of a business. So, let me remedy that expense by offering you a huge discount. Check out the pricing table below for details."
          }
        ]
      },
      _2: {
        name: 'cost',
        content: [
          {
            _0: "website pages",
            _1: "Includes a custom design. All content (ex: text, images, videos) you provide me with will be added.",
            _2: "$50 each"
          },
          {
            _0: "dashboard",
            _1: "With the dashboard, you can edit content on your website, edit existing product information, and add additional products at the click of a button. This is a computer application.",
            _2: "$10 / month"
          },
          {
            _0: "shopping cart",
            _1: "Includes shopping cart and payment pages. I will also set up a third party payment service that is linked directly to your bank card. The service gives you access to customer payment history, receipts, refunds, and more.",
            _2: "$80"
          },
          {
            _0: "device friendly layout",
            _1: "Your website layout will fit devices of your choice including cell phones, tablets, desktops, and televisions.",
            _2: "$25 each"
          },
          {
            _0: "sign in/sign up",
            _1: "Includes a sign in/sign up forms page linked to a database that stores usernames and passwords.",
            _2: "$50"
          },
          {
            _0: "email notifications",
            _1: "An application to email customers (ex. promotional sales). This computer and mobile app not to be displayed on your website.",
            _2: "$50"
          },
          {
            _0: "text notifications",
            _1: "An application to text customers (ex. appointment reminders). This computer and mobile app not to be displayed on your website.",
            _2: "$50"
          },
          {
            _0: "page animations",
            _1: "Custom animation to help your website stand out and build a smooth customer experience.",
            _2: "$50"
          },
          {
            _0: "contact form",
            _1: "This form is a convenient way for customers to contact you. This form will be on a page of your website.",
            _2: "$25"
          },
          {
            _0: "feedback form",
            _1: "This form is a convenient way for customers to leave feedback. This form will be on a page of your website.",
            _2: "$25"
          }
        ]
      },
      _3: {
        name: 'tips',
        content: [
          {
            _0: "EMAIL CUSTOMERS",
            _1: "Send emails promoting this week's sales.",
            _2: ""
          },
          {
            _0: "TEXT CUSTOMERS",
            _1: "Text appointment reminders and daily sales.",
            _2: "The following forms are linked to my email and cell phone. Try sending me a message with your name, contact, questions, and comments. I will get back to you as soon as I can!"
          }
        ]
      },
      _4: {
        name: 'contact',
        content: []
      }
    },
    products: { }
  }
  //send emails
  this.sendEmail = (reason, fromName) => {
    const serviceID = 'gmail';
    const templateID = 'template_hd4gZ80X';
    const message = `<p>${$('#editTextInput').val()}<p>`
    const email = {
      email: 'ijh5005@outlook.com',
      reply_to: 'ijh5005@outlook.com',
      name: reason,
      from_name: fromName,
      message_html: message
    }
    emailjs.send(serviceID, templateID, email);
  }
  //help text change
  this.changeHelpText = (helpText) => {
    $rootScope.helpText = appData['helpText'][helpText];
    $timeout(() => {
      $('#helpText p').addClass('flash');
    })
    $timeout(() => {
      $('#helpText p').removeClass('flash');
    }, 250)
  }
});

app.service('appData', function(){
  this.navOptions = [
    {name: 'EDIT PAGE TEXT', icon: 'fas fa-align-left'},
    {name: 'REPORT BUG', icon: 'fas fa-bug'},
    {name: 'CONTACT DEVELOPER', icon: 'fas fa-envelope'},
    {name: 'ADD PRODUCTS', icon: 'fas fa-plus'},
    {name: 'FEATURE IDEAS', icon: 'fas fa-lightbulb'}
  ];
  this.helpText = {
    initialText: 'CHOOSE FROM THE ABOVE OPTIONS',
    pageChoice: 'WHICH PAGE WOULD YOU LIKE TO EDIT?',
    contentChoice: 'WHICH SECTION OF THE PAGE WOULD YOU LIKE TO EDIT?',
    changeText: 'CHANGE THE TEXT AND PRESS UPDATE WHEN YOUR READY',
    bugFix: 'EXPLAIN THE BUG IN AS MUCH DETAIL AS POSSIBLE AND PRESS SEND',
    contact: 'SEND A MESSAGE AND I WILL GET BACK TO YOU AS SOON AS POSSIBLE',
    addProducts: 'WHICH PRODUCTS WOULD YOU LIKE TO ADD',
    ideas: 'WHAT WOULD YOU LIKE TO SEE ON THE DASHBOARD. I TAKE YOUR SUGGESTIONS SERIOUSLY AND WILL TRY TO GIVE YOU MORE.',
    comingSoon: 'FEATURE COMING SOON'
  }
})

app.filter('toReadableString', function($rootScope) {
  return function(input) {
    let output = '';
    const type = typeof input;
    if(type === 'string'){
      output = input;
    } else if(type === 'object'){
      const objKeys = Object.keys(input);
      let dataNum = '';
      $rootScope.editContent.map((data, index) => {
        dataNum = (data === input) ? index : dataNum;
      });
      objKeys.map((key, index) => {
        const currentHtml = $(`#editText[data="${dataNum}"]`).html();
        const html = (index === 0) ? input[key] + '<br><br>' : currentHtml + input[key] + '<br><br>';
        $(`#editText[data="${dataNum}"]`).html(html)
      })
      return;
    }
    return output;
  }
});
