Template.taskSetter.events({
    'submit form': (e) => {
        e.preventDefault();
        e.stopPropagation();

        let task = e.currentTarget.task.value;
        Meteor.call('updateTask', session, task, (err, res) => {
            if (err) {
                // This should actually never hit.
                showFailure(err.reason);
            } else {
                showSuccess();
            }
        });
    }
});

function showSuccess() {
    showAlert($('#success'));
}

function showFailure(msg) {
    $('#failure').text(msg);
    showAlert($('#failure'));
}

function showAlert(alert) {
    alert.animate({ opacity: 1 });
    setTimeout(() => { alert.animate({ opacity: 0 })}, 3000);
}
