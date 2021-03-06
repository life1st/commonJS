const fs = require('fs')
const path = require('path')
const open = require('open')
const { runServer } = require('./server')
const { repos, author } = require('./config')
var exec = require('child_process').exec;
function execute(command){
    return new Promise((resolve, reject) => {
      exec(command, function(error, stdout, stderr){ 
        if (error) reject(error)
        if (stderr) reject(stderr)

        resolve(stdout)
       });
    })
};

const getGitUser = async () => {
  const [name, email] = await Promise.all([execute("git config --global user.name"), execute("git config --global user.email")])
  
  return { name, email }
};

const getGitLog = async (config, folder) => {
  const cmds = folder ? [`git --git-dir ${folder}/.git log`] : ['git log']

  Object.keys(config).map(k => {
    cmds.push(`--${k}="${config[k]}"`)
  })
  
  const log = await execute(cmds.join(' '))

  return log
}

const formatLog = (data) => {
  const commits = data.split('commit')
  .filter(item => !!item.trim())
  .map(commit => {
    const data = ('commit' + commit)
    .split('\n')
    .filter(item => item !== '')
    .reduce((acc, item) => {
      if (item.includes('commit')) {
        acc.commit = item.replace('commit', '').trim()
      } else if (item.includes('Author')) {
        acc.author = item.replace('Author:', '').trim()
      } else if (item.includes('Date')) {
        acc.date = item.replace('Date:', '').trim()
      } else {
        acc.message = item.trim()
      }
      return acc
    }, {})

    return data
  })
  
  return commits
}

const save2file = (data, name) => {
  return new Promise((resolve, reject) => {
    const file = path.join(__dirname, './static', name)
    console.log(file)
    fs.writeFile(file, data, (e) => {
      if (e) reject(e)
      resolve()
    })
  })
}


// getGitUser().then(data => {console.log(data)})

// getGitLog({
//   author: 'jiaoyang',
// }, '/Users/jiaoy/Documents/Douban/code/standbyme').then(async data => {
//   const json = formatLog(data)
  
//   save2file(json, name)
// })
async function run() {
  const datas = await Promise.all(repos.map(repo => getGitLog({
    author,
  }, repo)))
  const repoNames = repos.map(repo => repo.split('/').pop())
  const formatData = datas
  .map(data => formatLog(data))
  .reduce((acc, data, i) => {
    acc[repoNames[i]] = data
    return acc
  }, {})
  
  await save2file(JSON.stringify(formatData), 'data.json')

  await runServer()
  await open('http://127.0.0.1:3000')
}                                                  

run()
