<template>
    

<h1>Tournament</h1>
<main id="tournament">

 <ul v-for="r in rounds" :class="'round ' + r.id" >
        <template   v-for="f in r.fixtures">
            <li class="spacer">&nbsp;</li>
            <li :class="'game game-top ' + isWinner(f.team_1, f.team_2, f.team_1, f.result)">{{f.team_1 }} <span>{{ f.result.score_team_1 }}</span></li>
            <li class="game game-spacer">&nbsp;</li>
            <li :class="'game game-bottom ' + isWinner(f.team_1, f.team_2, f.team_2, f.result)">{{ f.team_2 }} <span>{{ f.result.score_team_2 }}</span></li>
        </template>
        <li class="spacer">&nbsp;</li>
    </ul>
<!-- 
<ul class="round round-1">
    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Lousville <span>79</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">NC A&T <span>48</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Colo St <span>84</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Missouri <span>72</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top ">Oklahoma St <span>55</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom winner">Oregon <span>68</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Saint Louis <span>64</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">New Mexico St <span>44</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Memphis <span>54</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">St Mary's <span>52</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Mich St <span>65</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Valparaiso <span>54</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Creighton <span>67</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Cincinnati <span>63</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Duke <span>73</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Albany <span>61</span></li>

    <li class="spacer">&nbsp;</li>
  </ul>
  <ul class="round round-2">
    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Lousville <span>82</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Colo St <span>56</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Oregon <span>74</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Saint Louis <span>57</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top ">Memphis <span>48</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom winner">Mich St <span>70</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top ">Creighton <span>50</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom winner">Duke <span>66</span></li>

    <li class="spacer">&nbsp;</li>
  </ul>
  <ul class="round round-3">
    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Lousville <span>77</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Oregon <span>69</span></li>

    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top ">Mich St <span>61</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom winner">Duke <span>71</span></li>

    <li class="spacer">&nbsp;</li>
  </ul>
  <ul class="round round-4">
    <li class="spacer">&nbsp;</li>
    
    <li class="game game-top winner">Lousville <span>85</span></li>
    <li class="game game-spacer">&nbsp;</li>
    <li class="game game-bottom ">Duke <span>63</span></li>
    
    <li class="spacer">&nbsp;</li>
  </ul>     -->
</main>


</template>

<script>
export default {
  props: {
    teams: {
      type: Array,
      required: true,
    },
    rounds: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const getWinner = (team_1, team_2, result) => {
        if (result.score_team_1 > result.score_team_2) {
            return team_1;
        }
        if (result.score_team_1 < result.score_team_2) {
            return team_2
        }
        return null;
    }
    const isWinner = (team_1, team_2, thisTeam, result) => {
        console.log("team_1: "  + team_1)
        console.log("team_2: "  + team_2)
        console.log("thisTeam: "  + thisTeam)
        console.log("result: " + result)
        var winning_team = getWinner(team_1, team_2, result);
        if (winning_team) {
            if (winning_team == thisTeam) {
                return "winner"
            }
        }
        return ""
    }
    return {
        getWinner,
        isWinner
    }
  }

}
</script>
<style scoped>
main{
  display:flex;
  flex-direction:row;
}
.round{
  display:flex;
  flex-direction:column;
  justify-content:center;
  width:200px;
  list-style:none;
  padding:0;
}
  .round .spacer{ flex-grow:1; }
  .round .spacer:first-child,
  .round .spacer:last-child{ flex-grow:.5; }

  .round .game-spacer{
    flex-grow:1;
  }

/*
 *  General Styles
*/
body{
  font-family:sans-serif;
  font-size:small;
  padding:10px;
  line-height:1.4em;
}

li.game{
  padding-left:20px;
}

  li.game.winner{
    font-weight:bold;
  }
  li.game span{
    float:right;
    margin-right:5px;
  }

  li.game-top{ border-bottom:1px solid #aaa; }

  li.game-spacer{ 
    border-right:1px solid #aaa;
    min-height:40px;
  }

  li.game-bottom{ 
    border-top:1px solid #aaa;
  }

</style>