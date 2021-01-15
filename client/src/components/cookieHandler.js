import Cookies from 'universal-cookie'

export const cookies = new Cookies()

cookies.set('jobList', [])

export const addJobToCookie = (jobID) => {
    // fetch current cookie
    var jobList = new Array()
    var jobCookie
    const getCookie = async () => {
         jobCookie = await cookies.get()
         jobCookie.forEach(job => {
            jobList.push(job)
        })
        jobList.push(jobID)
        cookies.set('jobList', [jobList])
    } 
    // var jobCookie = cookies.get('jobList')
    // jobCookie.forEach(job => {
    //     jobList.push(job)
    // })
    // jobList.push(jobID)
    // cookies.set('jobList', [jobList])
}

export const clearJobsFromCookie = () => {
    var jobList = new Array()
    var jobCookie = cookies.get('jobList')
    jobCookie.forEach(job => {
        window.clearInterval(job)
    })
    cookies.set('jobList', [])
}