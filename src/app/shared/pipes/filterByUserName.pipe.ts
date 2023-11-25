import { Pipe, PipeTransform, NgModule } from "@angular/core";

@Pipe({
  name: "filterByUserName",
  pure: false
})
export class FilterByUserNamePipe implements PipeTransform {
  transform(value: any, filterString: string) {
    if (!value) return true;
    if (value.length === 0 || filterString === "") {
      return value;
    }
    const filterArray = [];
    for (let item of value) {
      if (!item["FirstName"]) {
        item["FirstName"] = "";
      }
      if (!item["LastName"]) {
        item["LastName"] = "";
      }
      if (filterString) {
        filterString = filterString.replace(new RegExp("\\\\", "g"), "\\\\");
      }
      if (filterString == "*") {
        filterString = "";
      }
      var regEx = new RegExp(filterString, "ig");
      var fullName = this.getFullName(item["FirstName"], item["LastName"]);
      if (fullName.match(regEx)) {
        filterArray.push(item);
      }
    }
    return filterArray;
  }

  getFullName(firstName, lastName) {
    return firstName + " " + lastName;
  }
}

@NgModule({
  declarations: [FilterByUserNamePipe],
  exports: [FilterByUserNamePipe]
})
export class FilterByUserNamePipeModule {}
