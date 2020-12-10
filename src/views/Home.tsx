import { Options, Vue } from 'vue-class-component';
import TestTsx from '@/components/TestTsx.tsx'; // @ is an alias to /src

@Options<Home>({
  render() {
    return (
      <div class="home" onClick={this.handleClick}>
        <img alt="Vue logo" src="../assets/logo.png" />
        <TestTsx message="Welcome to Your Vue.js + TypeScript App" />
      </div>
    );
  },
})
class Home extends Vue {
  handleClick() {
    console.log('aaaa');
  }
}
export default Home;
