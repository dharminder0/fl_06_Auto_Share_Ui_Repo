import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()

export class AnalyticsSubjectService{

    public versionSubject: Subject<any> = new Subject();
    public publishedId;

    /**
     * 
     * @param ver publishedId
     * set the version in versionSubject
     */
    setVersionData(ver){
        this.versionSubject.next(ver);
        this.publishedId = ver;
    }

    /** 
     * return publishedId 
    */
    getPublishedId(){
        return this.publishedId;
    }
}