Template.taskSetter.events({
    'submit form': function (e) {
        e.preventDefault();
        e.stopPropagation();

        let task = e.currentTarget.task.value;
        Meteor.call('updateTask', session, task);

        $('#success').animate({ opacity: 1 });
        setTimeout(function() { $('#success').animate({ opacity: 0 }); }, 3000);
    }
});
