export const getFilteredHours = (hourData, data) => {

    if (data) {

        const updatedData = [...data].filter((destination) => {

            if (destination.hours === "N/A") {
                return true;
            }

            if (hourData.day === "Any") {
                for (let i = 0; i < destination.hours.length; i++) {

                    const rest = destination.hours[i].split(":")[1].trim();
                    if (rest === "Closed") {
                        continue;
                    }
                    if (rest === "Open 24 hours") {
                        return true;
                    }

                    let timePattern, intervals;
                    if (destination.hours[i].includes(",")) {
                        timePattern = /\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM)?\b/gi;
                        intervals = destination.hours[i].split(",");
                    } else {
                        timePattern = /\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM)\b/gi;
                        intervals = [destination.hours[i]];
                    }
                    
                    const times = [];
                    for (let interval of intervals) {
                        let intervalTimes = interval.match(timePattern);
                        if (intervalTimes.length === 2 && !(intervalTimes[0].includes('AM') || intervalTimes[0].includes('PM'))) {
                            let amOrPm = intervalTimes[1].match(/(?:AM|PM)/gi)[0];
                            intervalTimes[0] = intervalTimes[0] + " " + amOrPm;
                        }
                        times.push(...intervalTimes);
                    }
                    
                    const militaryTimes = [];

                    for (let j = 0; j < times.length; j++) {
                        let militaryTime = 0;
                        if (times[j].includes("AM")) {
                            const timeArr = times[j].split(":");
                            if (timeArr[0] === 12) {
                                if (j === 0) {
                                    militaryTime = 0;
                                } else {
                                    militaryTime = 24;
                                }
                            } else {
                                militaryTime = parseFloat(timeArr[0]);
                            }
                            militaryTime += parseFloat((timeArr[1].substring(0, 2) / 60));

                        } else if (times[j].includes("PM")) {
                            const timeArr = times[j].split(":");
                            if (timeArr[0] === 12) {
                                militaryTime = 12;
                            } else {
                                militaryTime = 12 + parseFloat(timeArr[0]);
                            }
                            militaryTime += parseFloat((timeArr[1].substring(0, 2) / 60));
                        }

                        militaryTimes.push(militaryTime);
                    }

                    if (militaryTimes.length === 2) {
                        if (militaryTimes[0] >= hourData.hours[0] && militaryTimes[1] <= hourData.hours[1]) {
                            return true;
                        }
                    } else if (militaryTimes.length === 4) {
                        if ((militaryTimes[0] >= hourData.hours[0] && militaryTimes[1] <= hourData.hours[1]) ||
                            (militaryTimes[2] >= hourData.hours[0] && militaryTimes[3] <= hourData.hours[1])) {
                            return true;
                        }
                    }    
                }
            } else {
                for (let i = 0; i < destination.hours.length; i++) {

                    const dayIndex = destination.hours[i].indexOf(":");
                    const day = destination.hours[i].substring(0, dayIndex);

                    if (day !== hourData.day) {
                        continue;
                    }

                    const rest = destination.hours[i].split(":")[1].trim();
                    console.log(rest);
                    if (rest === "Closed") {
                        return false;
                    }
                    if (rest === "Open 24 hours") {
                        return true;
                    }

                    let timePattern, intervals;
                    if (destination.hours[i].includes(",")) {
                        timePattern = /\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM)?\b/gi;
                        intervals = destination.hours[i].split(",");
                    } else {
                        timePattern = /\b(?:1[0-2]|0?[1-9]):[0-5][0-9]\s?(?:AM|PM)\b/gi;
                        intervals = [destination.hours[i]];
                    }
                    
                    const times = [];
                    for (let interval of intervals) {
                        let intervalTimes = interval.match(timePattern);
                        if (intervalTimes.length === 2 && !(intervalTimes[0].includes('AM') || intervalTimes[0].includes('PM'))) {
                            let amOrPm = intervalTimes[1].match(/(?:AM|PM)/gi)[0];
                            intervalTimes[0] = intervalTimes[0] + " " + amOrPm;
                        }
                        times.push(...intervalTimes);
                    }

                    const militaryTimes = [];

                    for (let j = 0; j < times.length; j++) {
                        let militaryTime = 0;
                        if (times[j].includes("AM")) {
                            const timeArr = times[j].split(":");
                            if (timeArr[0] === 12) {
                                if (j === 0) {
                                    militaryTime = 0;
                                } else {
                                    militaryTime = 24;
                                }
                            } else {
                                militaryTime = parseFloat(timeArr[0]);
                            }
                            militaryTime += parseFloat((timeArr[1].substring(0, 2) / 60));

                        } else if (times[j].includes("PM")) {
                            const timeArr = times[j].split(":");
                            if (timeArr[0] === 12) {
                                militaryTime = 12;
                            } else {
                                militaryTime = 12 + parseFloat(timeArr[0]);
                            }
                            militaryTime += parseFloat((timeArr[1].substring(0, 2) / 60));
                        }

                        militaryTimes.push(militaryTime);
                    }

                    if (militaryTimes.length === 2) {
                        if (militaryTimes[0] >= hourData.hours[0] && militaryTimes[1] <= hourData.hours[1]) {
                            return true;
                        }
                    } else if (militaryTimes.length === 4) {
                        if ((militaryTimes[0] >= hourData.hours[0] && militaryTimes[1] <= hourData.hours[1]) ||
                            (militaryTimes[2] >= hourData.hours[0] && militaryTimes[3] <= hourData.hours[1])) {
                            return true;
                        }
                    }
                }
            }
            return false;
        })
        return updatedData;
    }
    return null;
};

export const getFilteredRatings = (value, data) => {

    if (data) {
        const updatedData = data.filter((destination) => destination.rating >= value);
        return updatedData;
    }
    return null;
}

export const getSortedData = (type, data) => {

    if (data) {

        if (type === "Rating") {

            const updatedData = [...data];
            updatedData.sort((a, b) => b.rating - a.rating);
            return updatedData;
        }  
        
        if (type === "Popularity") {

            const updatedData = [...data];
            updatedData.sort((a, b) => b.totalRatings - a.totalRatings);
            return updatedData;
        }  

        if (type === "Alphabetical Order") {

            const updatedData = [...data];
            updatedData.sort((a, b) => {
                
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
            });
            return updatedData;
        }
    }
    return null;
}
