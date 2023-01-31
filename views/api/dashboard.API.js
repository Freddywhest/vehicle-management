const totalS = document.getElementById('totalS');
const totalST = document.getElementById('totalST');
const totalBD = document.getElementById('totalBD');
const totalBW = document.getElementById('totalBW');
const totalBB = document.getElementById('totalBB');
const totalE = document.getElementById('totalE');
const totalD = document.getElementById('totalD');
const totalV = document.getElementById('totalV');
const totalW = document.getElementById('totalW');
const totalAd = document.getElementById('totalAd');

const loadDatas = (data) => {
    totalS.innerHTML = 'GH₵ '+data.sales.totalSales;
    totalST.innerHTML = 'GH₵ '+data.sales.totalToday;
    totalBD.innerHTML = 'GH₵ '+data.bank.totalDeposit;
    totalBW.innerHTML = 'GH₵ '+data.bank.totalWithdraw;
    totalBB.innerHTML = 'GH₵ '+data.bank.bankBalance;
    totalBB.style.color = parseInt(data.bank.bankBalance) < 0 ? 'red' : '';
    totalE.innerHTML = 'GH₵ '+data.expenses.totalExpenses;
    totalD.innerHTML = data.user.totalDrivers;
    totalV.innerHTML = data.user.totalVehicles;
    totalW.innerHTML = data.user.totalWorkers;
    totalAd.innerHTML = data.user.totalAdmins;
}

document.addEventListener('DOMContentLoaded', async () => {
    const request = await fetch('/api/totals?type=all');
    const response = await request.json();
    if(response.message && response.message === 'Redirect'){
        document.location.href = '/logout';
        return;
    }

    if(response.status){
        setTimeout(() => {
            loadDatas(response.data);
        }, 1500);
    }
})