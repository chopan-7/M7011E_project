import Cookies from 'universal-cookie'

export const cookies = new Cookies()

cookies.set('jobList', [])

export const addJobToCookie = (jobID) => {
    // fetch current cookie
    const jobList = new Array()
    const jobCookie = cookies.get('jobList')
    jobCookie.forEach(job => {
        jobList.push(job)
    })
    jobList.push(jobID)
    cookies.set('jobList', [jobList])
}

export const clearJobsFromCookie = () => {
    const jobList = new Array()
    const jobCookie = cookies.get('jobList')
    jobCookie.forEach(job => {
        window.clearInterval(job)
    })
    cookies.remove('jobList')
}