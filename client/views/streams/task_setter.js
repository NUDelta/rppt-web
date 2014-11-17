Template.taskSetter.events({
    'submit form': function (e) {
        e.preventDefault();
        e.stopPropagation();

        var newTask = $('#newTask').val();
        Meteor.call('setNewTask', newTask);

        $('#success').animate({opacity:1});        
        setTimeout(function () { $('#success').animate({opacity:0}); }, 3000);
    }
});