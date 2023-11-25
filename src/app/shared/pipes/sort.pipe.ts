import { Pipe, PipeTransform, NgModule } from '@angular/core';

@Pipe({
    name: 'sortBydate',
    pure: true
})

export class SortByDatePipe implements PipeTransform {

    transform(value: any,
        ascending: any): any {
        if (value.length === 0 || typeof (ascending) !== "boolean") {
            return value;
        }
        else {
            if (ascending) {
                return value.sort((a, b) => {
                    if (a.createdOn > b.createdOn) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                })
            }
            else {
                return value.sort((a, b) => {
                    if (a.createdOn > b.createdOn) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                })
            }
        }
    }
}

@Pipe({
    name: 'sortByTagColor',
    pure: false
})

export class sortByTagColor implements PipeTransform {

    quizWithTag = [];
    quizWithoutTag = [];
    COLORS = [
        {
            id: 0,
            value: '#DC143C',
        }, {
            id: 1,
            value: '#FF6347',
        }, {
            id: 2,
            value: '#ffb200',
        }, {
            id: 3,
            value: '#66CD00',
        }, {
            id: 4,
            value: '#009B2B',
        }, {
            id: 5,
            value: '#00BFFF',
        }, {
            id: 6,
            value: '#4876FF',
        }, {
            id: 7,
            value: '#9A32CD',
        }, {
            id: 8,
            value: '#CD00CD',
        }, {
            id: 9,
            value: '#FF69B4',
        }
    ];

    transform(value: any,
        ascending: any): any {
        if (value.length === 0 || typeof (ascending) !== "boolean") {
            return value;
        }
        else {
            this.quizWithoutTag = [];
            this.quizWithTag = [];
            value.forEach(quiz => {
                if (quiz.TagDetails.length) {
                    this.quizWithTag.push(quiz);
                }else{
                    this.quizWithoutTag.push(quiz);
                }
            });
            if (ascending) {
                this.quizWithTag.sort((a, b) => {
                    if (a.id > b.id) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                this.quizWithTag.push(...this.quizWithoutTag);
                return this.quizWithTag;
            } else {
                this.quizWithTag.sort((a, b) => {
                    if (a.id > b.id) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
                this.quizWithoutTag.push(...this.quizWithTag);
                return this.quizWithoutTag;
            }
        }
    }
}

@Pipe({
    name: 'sortByName',
    pure: true
})

export class SortByNamePipe implements PipeTransform {

    transform(value: any,
        ascending: any) {
        if (value.length === 0 || typeof (ascending) !== "boolean") {
            return value;
        } else {
            if (ascending) {
                return value.sort((a, b) => {

                    if (a.title.trim().toLowerCase() > b.title.trim().toLowerCase()) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                })
            }
            else {
                return value.sort((a, b) => {
                    if (a.title.trim().toLowerCase() > b.title.trim().toLowerCase()) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                })
            }
        }
    }
}

@Pipe({
    name: 'sortByTotal',
    pure: true
})

export class SortByTotalPipe implements PipeTransform {

    transform(value: any,
        ascending: any) {
        if (value.length === 0 || typeof (ascending) !== "boolean") {
            return value;
        } else {
            if (ascending) {
                return value.sort((a, b) => {
                    if (+a.data[0].total > +b.data[0].total) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                })
            }
            else {
                return value.sort((a, b) => {
                    if (+a.data[0].total > +b.data[0].total) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                })
            }
        }
    }
}

@Pipe({
    name: 'sortByConversion',
    pure: true
})

export class SortByConversionPipe implements PipeTransform {

    transform(value: any,
        ascending: any) {
        if (value.length === 0 || typeof (ascending) !== "boolean") {
            return value;
        } else {
            if (ascending) {
                return value.sort((a, b) => {

                    if ((+a.data[4].total) > (+b.data[4].total)) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                })
            }
            else {
                return value.sort((a, b) => {
                    if ((+a.data[4].total) > (+b.data[4].total)) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                })
            }
        }
    }
}

@NgModule({
    declarations: [SortByDatePipe, sortByTagColor, SortByNamePipe, SortByTotalPipe, SortByConversionPipe],
    exports: [SortByDatePipe, sortByTagColor, SortByNamePipe, SortByTotalPipe, SortByConversionPipe]
})

export class SortPipeModule { }