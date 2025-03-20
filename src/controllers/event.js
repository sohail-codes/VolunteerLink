import axios from "axios";
import prisma from "../client.js";




export const joinEvent = async (req, res) => {
    try {
        var { eventId } = req.body;
        await prisma.event.update({
            where: {
                uuid: eventId
            },
            data: {
                joinedBy: {
                    connect: {
                        uuid: req.user.uuid
                    }
                }
            }
        });
        return res.status(200).json({
            status: true,
            message: "Event Joined Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: error.message
        })
    }
}
export const exitEvent = async (req, res) => {
    try {
        var { eventId } = req.body;
        await prisma.event.update({
            where: {
                uuid: eventId
            },
            data: {
                joinedBy: {
                    disconnect: {
                        uuid: req.user.uuid
                    }
                }
            }
        });
        return res.status(200).json({
            status: true,
            message: "Event Exited Successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: error.message
        })
    }
}

export const GetEvents = async (req, res) => {
    try {
        var { search } = req.query;
        var query = {};
        if (search)
        {
            query = {
                title : {
                    contains : search
                }
            }
        }
        var events = await prisma.event.findMany({
            where : {
                ...query
            },
            include: {
                tags: true,
                organizer: true,
                location: {
                    include: {
                        regions: true
                    }
                }
            },
            take: 10,
            orderBy : {
                createdAt : 'desc'
            }
        });
        return res.status(200).json({
            status: true,
            data: events
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: error.message
        })
    }
}
export const joinedEvents = async (req, res) => {
    try {
        var { search } = req.query;
        var query = {};
        if (search)
        {
            query = {
                title : {
                    contains : search
                }
            }
        }
        var events = await prisma.event.findMany({
            where: {
                ...query,
                joinedBy: {
                    some: {
                        uuid: req.user.uuid
                    }
                }
            },
            include: {
                tags: true,
                organizer: true,
                location: {
                    include: {
                        regions: true
                    }
                }
            },
            take: 10,
            orderBy : {
                createdAt : 'desc'
            }
        });
        return res.status(200).json({
            status: true,
            data: events
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: error.message
        })
    }
}



export const syncVolunteerConnector = async (req, res) => {
    try {
        var { page } = req.query;
        if (!page) return res.status(422).json({
            status: false
        })
        var { data } = await axios.get(`https://www.volunteerconnector.org/api/search/`, {
            params: {
                page: page
            }
        });
        await saveVolunteerEvents(data.results)
        return res.status(200).json({
            status: true,
            data
        })
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            status: false,
            message: error.message
        })
    }
}


export const createEvent = async (req, res) => {
    try {
        console.log(req.body);
        const eventData = {
            title: req.body[0],
            description: req.body[1],
            date: req.body[2],
            startDate: new Date(req.body[2]),
            endDate: new Date(req.body[3]),
            url: req.body[4],
        };

        // Fetch or create location
        let location = null;
        if (!location) {
            location = await prisma.location.create({ 
                data: { 
                    locationType: "REGIONAL", 
                    longitude: 0, 
                    latitude: 0,
                    regions : {
                        connectOrCreate : {
                            where : {
                                name : req.body[5]
                            },
                            create : {
                                name : req.body[5]
                            }
                        }
                    }
                } 
            });
        }
        eventData.locationId = location.id;

        // Fetch or create organizer
        let organizer = await prisma.organizer.findFirst({ where: { name: req.body[6] } });
        if (!organizer) {
            organizer = await prisma.organizer.create({ data: { name: req.body[6] , url  : req.body[7]} });
        }
        eventData.organizerId = organizer.id;

        // Fetch or create source if applicable
        // let source = null;
        // if (req.body[7]) {
        //     source = await prisma.source.findFirst({ where: { name: req.body[7] } });
        //     if (!source) {
        //         source = await prisma.source.create({ data: { name: req.body[7] } });
        //     }
        //     eventData.sourceId = source.id;
        // }

        // Create event
        const event = await prisma.event.create({ data: eventData });
        return res.status(200).json({
            status : true, message : "Event Created"
        })
    } catch (error) {
        console.log(error);
    }
}

const saveVolunteerEvents = async (events) => {
    const source = await prisma.source.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'volunteerconnector',
        },
    });

    for (const eventData of events) {
        if (!await prisma.event.count({ where: { legacyId: eventData.id.toString(), source: { id: source.id } } })) {
            await prisma.$transaction(async (tx) => {
                // Handle Organizer
                const organizer = await tx.organizer.upsert({
                    where: { name: eventData.organization.name },
                    update: {},
                    create: {
                        name: eventData.organization.name,
                        logo: eventData.organization.logo,
                        url: eventData.organization.url,
                    },
                });

                // Handle Tags
                const tagOperations = eventData.activities.map((activity) =>
                    tx.tag.upsert({
                        where: { name: activity.name },
                        update: {},
                        create: { name: activity.name },
                    })
                );
                const tags = await Promise.all(tagOperations);

                // Handle Location Type
                const locationType = eventData.audience.scope === 'local' ? 'LOCAL' : 'REGIONAL';

                // Handle Regions
                let regions = [];
                if (eventData.audience.scope === 'regional' && eventData.audience.regions) {
                    regions = await Promise.all(eventData.audience.regions.map(regionName =>
                        tx.region.upsert({
                            where: { name: regionName },
                            update: {},
                            create: { name: regionName },
                        })
                    ));
                }

                // Handle Location
                const location = await tx.location.create({
                    data: {
                        locationType,
                        latitude: eventData.audience.latitude || 0,
                        longitude: eventData.audience.longitude || 0,
                        regions: regions.length > 0 ? { connect: regions.map(region => ({ name: region.name })) } : undefined,
                    },
                });

                const dateRange = eventData.dates.split(' - ');
                var startDate = dateRange.length > 1 ? new Date(dateRange[0]) : new Date();
                var endDate = dateRange.length > 1 ? new Date(dateRange[1]) : new Date();
                if (startDate == "Invalid Date") startDate = null;
                if (endDate == "Invalid Date") endDate = null;
                // Handle Event
                await tx.event.create({
                    data: {
                        title: eventData.title,
                        description: eventData.description,
                        date: eventData.dates,
                        startDate,
                        endDate,
                        url: eventData.url,
                        legacyId: eventData.id.toString(),
                        organizer: { connect: { id: organizer.id } },
                        location: { connect: { id: location.id } },
                        source: { connect: { id: source.id } },
                        tags: { connect: tags.map(tag => ({ id: tag.id })) },
                    },
                });
            });
        }
    }
};
