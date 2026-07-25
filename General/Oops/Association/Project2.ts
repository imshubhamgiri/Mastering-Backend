class Instructor{
    private courses:Course[] = [];
    constructor(private name:string ){};

    addCourse(course:Course){
        if(!this.courses.includes(course)){
            this.courses.push(course);
            console.log('Course included ' + course.getTitle() + ' to the' , this.name)
            course.addInstructor(this)
        }
    }

    getName(): string { return this.name; }

}

class Student{
    private courses: Course[] = [];
    constructor(private name:string ){};

    enrollCourse(course:Course){
        if(!this.courses.includes(course)){
            this.courses.push(course);
            course.enrollStudent(this);
        }
    }

    getName(): string { return this.name; }
    getCourses(): Course[] { return this.courses; }
}

class Course{
    private instructor?: Instructor;
    private students: Student[] = [];
    constructor(private name:string ){};

    addInstructor(instructor:Instructor){
        this.instructor = instructor;
    }

    enrollStudent(student:Student){
        if(!this.students.includes(student)){
            this.students.push(student);
            student.enrollCourse(this);
        }
    }

    getStudents():Student[]{
        return this.students;
    }
    getInstructor(): Instructor | undefined { return this.instructor; }
    getTitle():string{
        return this.name;
    }
}

const bunty = new Student('bunty');
const lucky = new Student('lucky');
const bhalu = new Student('bhalu');
const ram   = new Student('Ram');

const instructor1 = new Instructor('Instructor1')
const instructor2 = new Instructor('Instructor2')
const instructor3 = new Instructor('Instructor3')


const GenAiCourse = new Course('Gen Ai');  
const BackendCourse = new Course('Backend Development');  
const SpringBootCourse = new Course('Spring Boot');  
const ReactCourse = new Course('React');  

// Many to Many Association
instructor1.addCourse(GenAiCourse);
instructor1.addCourse(BackendCourse);
instructor2.addCourse(SpringBootCourse);
instructor3.addCourse(ReactCourse);


// Many to Many Association
bunty.enrollCourse(GenAiCourse);
bunty.enrollCourse(BackendCourse);
lucky.enrollCourse(GenAiCourse);
lucky.enrollCourse(SpringBootCourse);
lucky.enrollCourse(ReactCourse);
bhalu.enrollCourse(BackendCourse);
bhalu.enrollCourse(SpringBootCourse);

// console.log('bunty.getCourses():', bunty.getCourses().map(c => c.getTitle() + ' - Instructor: ' + c.getInstructor()?.getName()));
// console.log('lucky.getCourses():', lucky.getCourses().map(c => c.getTitle() + ' - Instructor: ' + c.getInstructor()?.getName()));
// console.log('bhalu.getCourses():', bhalu.getCourses().map(c => c.getTitle() + ' - Instructor: ' + c.getInstructor()?.getName()));

console.log(`Students in ${GenAiCourse.getTitle()}:`);
for (const s of GenAiCourse.getStudents())
    console.log(`  - ${s.getName()}`);