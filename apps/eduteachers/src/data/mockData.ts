// src/data/mockData.ts
// TimeSlot was imported but never used
import { Teacher, Booking } from '@/types';
import park from '../../../eduguiders/src/assets/images/park.jpg';
import nature from '../../../eduguiders/src/assets/images/nature.jpg';
import setup from '../../../eduguiders/src/assets/images/bannerBackground.png';
import photo from '../../../../packages/ui/src/images/photo.jpeg';

// Helper to create time slots for a day
const createDaySlots = (day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', baseId: string) => {
    const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

    return times.map((time, index) => {
        // Create a pattern of availability
        let status: 'available' | 'booked' | 'unavailable';
        let studentId: string | undefined;
        let studentName: string | undefined;
        let topic: string | undefined;

        // Lunch time is always unavailable
        if (time === '12:00' || time === '13:00') {
            status = 'unavailable';
        }
        // Weekends have limited hours
        else if (day === 'sat' && parseInt(time) >= 13) {
            status = 'unavailable';
        }
        else if (day === 'sun') {
            status = 'unavailable';
        }
        // Add some booked slots
        else if ((day === 'mon' && (time === '11:00' || time === '17:00')) ||
            (day === 'tue' && (time === '09:00' || time === '16:00')) ||
            (day === 'wed' && (time === '14:00' || time === '15:00'))) {
            status = 'booked';
            studentId = `student${index + 1}`;
            studentName = `Example Student ${index + 1}`;
            topic = ['Algebra', 'Calculus', 'Statistics', 'Geometry'][index % 4];
        }
        // The rest are available
        else {
            status = 'available';
        }

        return {
            id: `${baseId}-${day}-${time}`,
            day,
            time,
            status,
            studentId,
            studentName,
            topic,
            bookingDate: status === 'booked' ? '2024-02-20T10:00:00Z' : undefined
        };
    });
};

// Create a weekly schedule
const createWeeklySchedule = (teacherId: string, weekStartDate: string) => {
    const days: Array<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'> =
        ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    const slots = days.flatMap(day =>
        createDaySlots(day, `${teacherId}-${weekStartDate}-${day}`)
    );

    return {
        weekStartDate,
        slots
    };
};

// Mock teachers data
export const mockTeachers: Teacher[] = [
    {
        id: 'teacher1',
        name: 'Yahir Adolfo Beras',
        title: 'Musician, Programmer and English Teacher',
        profilePicture: photo,
        landscapePicture: setup,
        bio: {
            introduction: [
                'Yahir Adolfo is a mesmerizing person. At the age of 17, with no clear skills to see, he started studying just for the fun of it. Little did he know where that would take him',
                'With no background or any particular special studies behind him, he just started pressing some random keys on a piano. Then learning English on Duolingo, to creating his own platform.',
                'Besides all these abilities, he works and is and amazing and proficient teacher loved by all of those who have had the oportunity to be alongside him, reporting to have gotten the motivation and knowledge to continue.',
                'When not teaching or working on his programming projects, Yahir loves to play some chess, hang out with friends, go to the church, explore and last but not least, eat a lot.'
            ],
            quote: '"Behind all talent is a world of horror and slavery. Gold molded by the roughest earth to be the most brilliant" — Yahir Adolfo',
            expertiseAreas: [
                { icon: 'fa fa-chalkboard-teacher', name: 'Teaching' },
                { icon: 'fa fa-language', name: 'Language Learning' },
                { icon: 'fa fa-code', name: 'Programming' },
                { icon: 'fa fa-music', name: 'Piano' }
            ]
        },
        cv: {
            education: [
                {
                    id: 'edu1',
                    years: '2012-2014',
                    degree: 'M.Sc. in Mathematics Education',
                    institution: 'Stanford University',
                    highlight: 'Thesis: "Interactive Approaches to Teaching Complex Mathematical Concepts"'
                },
                {
                    id: 'edu2',
                    years: '2008-2012',
                    degree: 'B.Sc. in Mathematics',
                    institution: 'MIT',
                    highlight: 'Minor in Educational Psychology'
                }
            ],
            experience: [
                {
                    id: 'exp1',
                    years: '2018-Present',
                    position: 'Lead Mathematics Instructor',
                    company: 'Global Education Initiative',
                    achievements: [
                        'Developed comprehensive curriculum for advanced mathematics courses',
                        'Created digital learning materials used by over 5,000 students globally',
                        'Pioneered the integration of AR/VR technologies in mathematics education'
                    ]
                },
                {
                    id: 'exp2',
                    years: '2014-2018',
                    position: 'Mathematics Department Chair',
                    company: 'International Academy of Sciences',
                    achievements: [
                        'Led a team of 12 mathematics educators',
                        'Increased student performance metrics by 32% within first year',
                        'Implemented innovative assessment methodologies'
                    ]
                }
            ],
            certifications: [
                {
                    id: 'cert1',
                    year: '2022',
                    name: 'Excellence in Mathematics Education Award',
                    issuer: 'International Association of Mathematics Educators'
                },
                {
                    id: 'cert2',
                    year: '2020',
                    name: 'Certified Advanced Mathematics Instructor',
                    issuer: 'Global Mathematics Institute'
                }
            ]
        },
        contact: {
            email: 'yahir.beras@example.com',
            videoCallAvailable: true,
            chatAvailable: true,
            socialLinks: {
                twitter: '#',
                linkedin: '#',
                youtube: '#',
                instagram: '#'
            }
        },
        availability: [
            createWeeklySchedule('teacher1', '2024-02-19'), // Previous week
            createWeeklySchedule('teacher1', '2024-02-26'), // Current week
            createWeeklySchedule('teacher1', '2024-03-04')  // Next week
        ],
        posts: [
            {
                id: 'post1',
                title: 'Understanding Algebra Through Visual Models',
                snippet: 'A comprehensive approach to algebraic concepts using visual representations and real-world applications.',
                image: '/api/placeholder/400/250',
                date: '2024-02-15',
                type: 'video',
                link: '#'
            },
            {
                id: 'post2',
                title: 'Interactive Learning Techniques for Remote Education',
                snippet: 'Discover modern teaching methods that engage students in online and hybrid learning environments.',
                image: '/api/placeholder/400/250',
                date: '2024-01-28',
                type: 'article',
                link: '#'
            }
        ],
        rating: 4.9,
        reviewCount: 124
    },
    {
        id: 'teacher2',
        name: 'Sofia Rodriguez',
        title: 'Language Arts & Literature Specialist',
        profilePicture: '/api/placeholder/160/160',
        landscapePicture: park,
        bio: {
            introduction: [
                'Sofia Rodriguez is a dedicated language arts educator with a passion for literature and creative writing. With 8 years of teaching experience, she has developed methods that inspire students to explore the power of language and storytelling.',
                'Her approach combines classical literary analysis with contemporary communication skills, preparing students not just for academic success but for effective expression in all aspects of life.',
                'Sofia believes that every student has a unique voice and perspective that deserves to be heard and developed. Her classroom is a space where creativity meets critical thinking.',
                'When not teaching, Sofia writes short fiction and poetry, and volunteers with literacy programs in underserved communities.'
            ],
            quote: '"The limits of my language mean the limits of my world." — Ludwig Wittgenstein',
            expertiseAreas: [
                { icon: 'book', name: 'Contemporary Literature' },
                { icon: 'pencil-alt', name: 'Creative Writing' },
                { icon: 'comments', name: 'Public Speaking' },
                { icon: 'paragraph', name: 'Critical Analysis' }
            ]
        },
        cv: {
            education: [
                {
                    id: 'edu1',
                    years: '2013-2015',
                    degree: 'M.A. in English Literature',
                    institution: 'Columbia University',
                    highlight: 'Thesis: "Narratives of Identity in Contemporary Fiction"'
                },
                {
                    id: 'edu2',
                    years: '2009-2013',
                    degree: 'B.A. in English and Education',
                    institution: 'University of California, Berkeley',
                    highlight: 'Summa Cum Laude'
                }
            ],
            experience: [
                {
                    id: 'exp1',
                    years: '2019-Present',
                    position: 'Senior English Instructor',
                    company: 'Westlake Academy',
                    achievements: [
                        'Developed innovative curriculum combining classic and modern literature',
                        'Created writing workshop program adopted by three other schools',
                        'Mentored over 40 students in successful college application essays'
                    ]
                },
                {
                    id: 'exp2',
                    years: '2015-2019',
                    position: 'English Teacher',
                    company: 'Riverside High School',
                    achievements: [
                        'Increased AP Literature pass rates by 34%',
                        'Founded and advised the school literary magazine',
                        'Developed cross-curricular projects with History and Art departments'
                    ]
                }
            ],
            certifications: [
                {
                    id: 'cert1',
                    year: '2021',
                    name: 'Innovation in Language Arts Education Award',
                    issuer: 'National Council of Teachers of English'
                },
                {
                    id: 'cert2',
                    year: '2018',
                    name: 'Certified Advanced Writing Instructor',
                    issuer: 'Creative Writing Institute'
                }
            ]
        },
        contact: {
            email: 'sofia.rodriguez@example.com',
            videoCallAvailable: true,
            chatAvailable: true,
            socialLinks: {
                twitter: '#',
                linkedin: '#',
                instagram: '#'
            }
        },
        availability: [
            createWeeklySchedule('teacher2', '2024-02-19'),
            createWeeklySchedule('teacher2', '2024-02-26'),
            createWeeklySchedule('teacher2', '2024-03-04')
        ],
        posts: [
            {
                id: 'post1',
                title: 'Finding Your Voice: A Guide to Personal Essay Writing',
                snippet: 'Techniques for developing authentic self-expression in academic and creative writing.',
                image: '/api/placeholder/400/250',
                date: '2024-02-10',
                type: 'article',
                link: '#'
            },
            {
                id: 'post2',
                title: 'Literary Analysis for the Modern Reader',
                snippet: 'How to approach complex texts and extract meaningful insights for todays world.',
                image: '/api/placeholder/400/250',
                date: '2024-01-15',
                type: 'video',
                link: '#'
            }
        ],
        rating: 4.8,
        reviewCount: 98
    },
    {
        id: 'teacher3',
        name: 'David Chen',
        title: 'Physics & Engineering Educator',
        profilePicture: '/api/placeholder/160/160',
        landscapePicture: nature,
        bio: {
            introduction: [
                'David Chen bridges theoretical physics with practical engineering applications in his innovative approach to STEM education. With a background in aerospace engineering and 12 years in education, he excels at making complex concepts tangible and engaging.',
                'His teaching methodology focuses on project-based learning, where students apply physics principles to solve real-world engineering challenges. This approach has consistently produced exceptional outcomes in student comprehension and retention.',
                'David believes that understanding the fundamental laws of physics is essential for developing the next generation of innovators and problem-solvers. His classes emphasize both theoretical understanding and hands-on application.',
                'Outside the classroom, David collaborates with industry partners to develop educational technologies and participates in community outreach programs promoting STEM education.'
            ],
            quote: '"Physics is the poetry of reality. Engineering is putting that poetry to work." — Unknown',
            expertiseAreas: [
                { icon: 'atom', name: 'Quantum Physics' },
                { icon: 'rocket', name: 'Mechanics & Dynamics' },
                { icon: 'cogs', name: 'Engineering Design' },
                { icon: 'microchip', name: 'Electronics' }
            ]
        },
        cv: {
            education: [
                {
                    id: 'edu1',
                    years: '2010-2014',
                    degree: 'Ph.D. in Applied Physics',
                    institution: 'California Institute of Technology',
                    highlight: 'Dissertation: "Quantum Effects in Microscale Mechanical Systems"'
                },
                {
                    id: 'edu2',
                    years: '2006-2010',
                    degree: 'M.Eng. in Aerospace Engineering',
                    institution: 'Massachusetts Institute of Technology',
                    highlight: 'Focus on propulsion systems'
                }
            ],
            experience: [
                {
                    id: 'exp1',
                    years: '2018-Present',
                    position: 'Director of STEM Education',
                    company: 'Innovation Academy',
                    achievements: [
                        'Developed integrated physics and engineering curriculum',
                        'Established partnerships with 5 major tech companies for student projects',
                        'Created advanced research program for high school students'
                    ]
                },
                {
                    id: 'exp2',
                    years: '2014-2018',
                    position: 'Physics Professor',
                    company: 'Pacific State University',
                    achievements: [
                        'Published 12 papers on physics education methodologies',
                        'Redesigned introductory physics courses with 27% improved outcomes',
                        'Mentored 18 undergraduate research projects'
                    ]
                }
            ],
            certifications: [
                {
                    id: 'cert1',
                    year: '2023',
                    name: 'Excellence in STEM Education Award',
                    issuer: 'National Science Teachers Association'
                },
                {
                    id: 'cert2',
                    year: '2019',
                    name: 'Advanced Certification in Project-Based Learning',
                    issuer: 'Buck Institute for Education'
                }
            ]
        },
        contact: {
            email: 'david.chen@example.com',
            videoCallAvailable: true,
            chatAvailable: true,
            socialLinks: {
                linkedin: '#',
                youtube: '#'
            }
        },
        availability: [
            createWeeklySchedule('teacher3', '2024-02-19'),
            createWeeklySchedule('teacher3', '2024-02-26'),
            createWeeklySchedule('teacher3', '2024-03-04')
        ],
        posts: [
            {
                id: 'post1',
                title: 'Quantum Concepts Made Simple',
                snippet: 'Breaking down the fundamentals of quantum physics with everyday analogies.',
                image: '/api/placeholder/400/250',
                date: '2024-02-18',
                type: 'video',
                link: '#'
            },
            {
                id: 'post2',
                title: 'Building Your First Robot: A Beginners Guide',
                snippet: 'Step-by-step instructions for creating a simple robot while learning key engineering principles.',
                image: '/api/placeholder/400/250',
                date: '2024-01-22',
                type: 'article',
                link: '#'
            }
        ],
        rating: 4.9,
        reviewCount: 156
    }
];

// Mock bookings data
export const mockBookings: Booking[] = [
    {
        id: 'booking1',
        teacherId: 'teacher1',
        studentId: 'student1',
        slotId: 'teacher1-2024-02-26-mon-11:00',
        status: 'confirmed',
        date: '2024-02-26',
        time: '11:00',
        topic: 'Algebra',
        notes: 'Need help with quadratic equations',
        createDate: '2024-02-20T10:00:00Z'
    },
    {
        id: 'booking2',
        teacherId: 'teacher1',
        studentId: 'student2',
        slotId: 'teacher1-2024-02-26-mon-17:00',
        status: 'confirmed',
        date: '2024-02-26',
        time: '17:00',
        topic: 'Calculus',
        notes: 'Preparing for upcoming exam',
        createDate: '2024-02-21T14:30:00Z'
    },
    {
        id: 'booking3',
        teacherId: 'teacher2',
        studentId: 'student1',
        slotId: 'teacher2-2024-02-26-tue-09:00',
        status: 'confirmed',
        date: '2024-02-27',
        time: '09:00',
        topic: 'Essay Writing',
        createDate: '2024-02-22T09:15:00Z'
    },
    {
        id: 'booking4',
        teacherId: 'teacher3',
        studentId: 'student2',
        slotId: 'teacher3-2024-02-26-wed-14:00',
        status: 'pending',
        date: '2024-02-28',
        time: '14:00',
        topic: 'Circuit Design',
        notes: 'Need help with a project',
        createDate: '2024-02-23T16:45:00Z'
    }
];