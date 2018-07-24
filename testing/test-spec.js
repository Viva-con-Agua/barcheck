describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://juliemr.github.io/protractor-demo/');

    expect(browser.getTitle()).toEqual('Super Calculator');
  });
});


/*describe('angularjs homepage todo list', function() {
  it('Open menu', function() {
    browser.get('http://localhost:8080');
    browser.ignoreSynchronization = true;
    element(by.name('menu')).click();
    browser.sleep(3000);
    element(by.name('locations')).click();
    browser.sleep(7000);
    element(by.name('locationsSearch')).click();
    browser.sleep(7000);

    element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    todoList.get(2).element(by.css('input')).click();
    var completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2); 
  });
}); */