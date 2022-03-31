import {Injectable} from '@angular/core'

@Injectable()
export class MessagesService {


    private messages = [];

    private messages1 = [
        {
            name: 'ashley',
            text: 'Still Around',
            time: '1 hrs ago'
        },
        {
            name: 'michael',
            text: 'Left',
            time: '2 hrs ago'
        },
        {
            name: 'julia',
            text: 'Came',
            time: 'Jan 24, 2020'
        },
        // {
        //     name: 'bruno',
        //     text: 'Explore your passions and discover new ones by getting involved. Stretch your...',
        //     time: '1 day ago'
        // },
        // {
        //     name: 'tereza',
        //     text: 'Get to know who we are - from the inside out. From our history and culture, to the...',
        //     time: '1 day ago'
        // },
        // {
        //     name: 'adam',
        //     text: 'Need some support to reach your goals? Apply for scholarships across...',
        //     time: '2 days ago'
        // },
        // {
        //     name: 'michael',
        //     text: 'Wrap the dropdown\'s trigger and the dropdown menu within .dropdown, or...',
        //     time: '1 week ago'
        // }
    ];   

    private files = [        
        {
            text:'Donation',
            size: 'N3,000.00',
            value: '0',
            color: 'primary'
        },
        {
            text: 'documentation.pdf',
            size: '~14.6 MB',
            value: '33',
            color: 'accent'
        },
        {
            text: 'wallpaper.jpg',
            size: '~558 KB',
            value: '60',
            color: 'warn'
        },
        {
            text: 'letter.doc',
            size: '~57 KB',
            value: '80',
            color: 'primary'
        },
        {
            text: 'azimuth.zip',
            size: '~10.2 MB',
            value: '55',
            color: 'warn'
        },
        {
            text: 'contacts.xlsx',
            size: '~96 KB',
            value: '75',
            color: 'accent'
        }
    ];

    private meetings = [
        {
            day: '09',
            month: 'May',
            title: 'Meeting with Estate Admin',
            text: 'To discuss on estate matter',
            color: 'danger'
        },       
        {
            day: '15',
            month: 'May',
            title: 'Training course',
            text: 'Organize for Children',
            color: 'primary'
        },
        // {
        //     day: '12',
        //     month: 'June',
        //     title: 'Dinner with Ashley',
        //     text: 'Curabitur rhoncus facilisis augue sed fringilla.',
        //     color: 'info'
        // },
        // {
        //     day: '14',
        //     month: 'June',
        //     title: 'Sport time',
        //     text: 'Vivamus tristique enim eros, ac ultricies sem ultrices vitae.',
        //     color: 'warning'
        // },
        // {
        //     day: '29',
        //     month: 'July',
        //     title: 'Birthday of Julia',
        //     text: 'Nam porttitor justo nec elit efficitur vestibulum.',
        //     color:'success'
        // }
    ];

    public getMessages():Array<Object> {
        return this.messages;
    }

    public getFiles():Array<Object> {
        return this.files;
    }

    public getMeetings():Array<Object> {
        return this.meetings;
    }   

}