import { NotificationService } from '../../services/notification/notification.service';
import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { filter, map } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { navMenuModel } from 'src/app/models/nav';
import { MENU_ITEMS, OPTION_ITEMS } from 'src/app/templates/menu';
import { LazyLoadEvent } from 'primeng/api';
import { SocketMasterService } from 'src/app/services/miscellaneous/socket.service';

interface CustomMenuItem extends NbMenuItem {
  id?: string;
  permissions?: any
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  navItems: CustomMenuItem[] = [];
  navMenu: navMenuModel[] = [];
  username!: string;
  rol!: string;
  title: any;
  userMenuItems: NbMenuItem[] = [
    { title: 'Modo Nocturno' },
    { title: 'Salir' }
  ];
  isCollapsed = false;
  isPhone!: boolean;
  router: any;
  loading: boolean = false;
  notifications: any[] = []
  virtualnotifications: any[] = []
  totalnotificactions: any;

  constructor(
    public authService: AuthService,
    private nbmenuService: NbMenuService,
    private socketService: SocketMasterService,
    private sidebarService: NbSidebarService,
    private NotificationService: NotificationService) { }

  ngOnInit(): void {
    this.getMenu();
    this.checkViewport();
    this.getNotifications();
    window.addEventListener('resize', this.checkViewport);
    // Escuchar eventos de notificación en la sala del usuario
    this.socketService.on('notification', (res: any) => {
      this.getNotifications();
    });
  }

  getNotifications() {
    this.loading = true;
    this.NotificationService.getNotifications().subscribe((data: any) => {
      this.notifications = data.items
      this.totalnotificactions = data.total
      this.loading = false;
    });
    this.virtualnotifications = Array.from({ length: 10000 });
  }

  getMenu() {
    const userPermissions = this.authService.getUserPermissions();
    this.username = this.authService.getUsername();
    this.rol = this.authService.getRol();
    this.navItems = this.filterMenuItems(userPermissions);
    this.navMenu = OPTION_ITEMS;
    this.nbmenuService.onItemClick().pipe(filter(({ tag }) => tag === 'my-context-menu'),
      map(({ item: { title } }) => title)).subscribe(title => {
        switch (title) {
          case 'Modo Oscuro':
          case 'Cerrar Sesión':
            this.logout()
            break;
        }
      });
  }

  filterMenuItems(userPermissions: any[], menuItems: CustomMenuItem[] = MENU_ITEMS): CustomMenuItem[] {
    return menuItems.filter((menuItem) => {
      if (menuItem.children) {
        // Si tiene hijos, filtramos recursivamente los hijos
        menuItem.children = this.filterMenuItems(userPermissions, menuItem.children);
        // Mostramos el elemento padre solo si tiene hijos visibles
        return menuItem.children.length > 0;
      } else if (menuItem.id) {
        return userPermissions.some((permission) => {
          return String(menuItem.id) === String(permission.idcomponente) && permission.ver === 1;
        });
      }
      return true;
    }) as CustomMenuItem[];
  }

  readNotification(id: number) {
    this.NotificationService.readNotification(id).subscribe((data: any) => {
      this.getNotifications();
    })
  }

  toggleSidebar(): void {
    this.sidebarService.toggle(true, 'sidebar');
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.isCollapsed = collapsed;
  }

  logout() {
    this.authService.logout();
  }

  checkViewport = () => {
    this.isPhone = window.innerWidth <= 767;
    if (this.isPhone) {
      this.sidebarService.collapse('sidebar');
    } else {
      this.sidebarService.expand('sidebar');
    }
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.checkViewport);
  }

}
