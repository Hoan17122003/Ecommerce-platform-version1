// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from 'src/order/order.controller';
import { OrderService } from 'src/order/order.service';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { ProductService } from 'src/product/product.service';
import { RedisService } from 'src/redis/Redis.service';
import { NotificationsGateway } from 'src/notification/notification.gateway';
import { OrderDTO } from 'src/order/dto/order.dto';

describe('OrderController', () => {
    let orderController: OrderController;
    let orderService: OrderService;
    let orderDetailService: OrderDetailService;
    let productService: ProductService;
    let redisService: RedisService;
    let notificationGateWay: NotificationsGateway;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [OrderController],
            providers: [OrderService, OrderDetailService, ProductService, RedisService, NotificationsGateway],
        }).compile();

        orderController = app.get<OrderController>(OrderController);
        orderService = app.get<OrderService>(OrderService);
        orderDetailService = app.get<OrderDetailService>(OrderDetailService);
        productService = app.get<ProductService>(ProductService);
        redisService = app.get<RedisService>(RedisService);
        notificationGateWay = app.get<NotificationsGateway>(NotificationsGateway);
    });

    describe('BuyProduct', () => {
        it('should return success message when purchase is made', async () => {
            const mockOrderDTO: OrderDTO = {
                // Populate with valid order data
                MaSanPham: 105,
                SoLuong: 2,
                KichThuoc: 'XL',
                MauSac: 'Xanh',
                phuongThucThanhToan: 'Thanh toán trực tiếp',
                diaChi: '61 Mạc Đỉnh Chi, Phương Gia Hội, Tp.Huế',
                MaGiamGia: null,
            };

            const mockSession = {
                user: {
                    payload: 'mock_maNguoiMuaHang',
                },
            };

            const mockNguoiMuaHang = {
                HoDem: 'John',
                Ten: 'Doe',
                MaNguoiMuaHang: 'mock_maNguoiMuaHang',
            };

            const mockDonhang = {
                MaNguoiBanHang: 'mock_maNguoiBanHang',
            };

            const mockChitietdonhang = {
                MaSanPham: 'mock_maSanPham',
            };

            jest.spyOn(orderService, 'buyProduct').mockResolvedValue({
                Donhang: mockDonhang,
                Chitietdonhang: mockChitietdonhang,
            });

            jest.spyOn(notificationGateWay, 'sendNotification').mockResolvedValue(true);

            const result = await orderController.BuyProduct(mockOrderDTO, mockSession);

            expect(result).toBe('bạn đã đặt hàng thành công');
        });

        it('should throw error when purchase fails', async () => {
            const mockOrderDTO: OrderDTO = {
                // Populate with valid order data
                MaSanPham: 106,
                SoLuong: 3,
                KichThuoc: 'XL',
                MauSac: 'Xanh',
                phuongThucThanhToan: 'Thanh toán trực tiếp',
                diaChi: '61 Mạc Đỉnh Chi, Phương Gia Hội, Tp.Huế',
                MaGiamGia: null,
            };

            const mockSession = {
                user: {
                    payload: 'mock_maNguoiMuaHang',
                },
            };

            jest.spyOn(orderService, 'buyProduct').mockRejectedValue(new Error('Purchase failed'));

            try {
                await orderController.BuyProduct(mockOrderDTO, mockSession);
            } catch (error) {
                expect(error.message).toBe('Purchase failed');
            }
        });

        it('should throw error when notification fails', async () => {
            const mockOrderDTO: OrderDTO = {
                // Populate with valid order data
                MaSanPham: 105,
                SoLuong: 2,
                KichThuoc: 'XL',
                MauSac: 'Xanh',
                phuongThucThanhToan: 'Thanh toán trực tiếp',
                diaChi: '61 Mạc Đỉnh Chi, Phương Gia Hội, Tp.Huế',
                MaGiamGia: null,
            };

            const mockSession = {
                user: {
                    payload: 'mock_maNguoiMuaHang',
                },
            };

            const mockDonhang = {
                MaNguoiBanHang: 'mock_maNguoiBanHang',
            };

            const mockChitietdonhang = {
                MaSanPham: 'mock_maSanPham',
            };

            jest.spyOn(orderService, 'buyProduct').mockResolvedValue({
                Donhang: mockDonhang,
                Chitietdonhang: mockChitietdonhang,
            });

            jest.spyOn(notificationGateWay, 'sendNotification').mockRejectedValue(new Error('Notification failed'));

            try {
                await orderController.BuyProduct(mockOrderDTO, mockSession);
            } catch (error) {
                expect(error.message).toBe('Notification failed');
            }
        });

        it('should throw error when order data is invalid', async () => {
            const mockOrderDTO: OrderDTO = {
                // Populate with invalid order data
                MaSanPham: -1,
                SoLuong: 2,
                KichThuoc: 'XL',
                MauSac: 'Xanh',
                phuongThucThanhToan: 'Thanh toán trực tiếp',
                diaChi: '61 Mạc Đỉnh Chi, Phương Gia Hội, Tp.Huế',
                MaGiamGia: null,
            };

            const mockSession = {
                user: {
                    payload: 'mock_maNguoiMuaHang',
                },
            };

            try {
                await orderController.BuyProduct(mockOrderDTO, mockSession);
            } catch (error) {
                expect(error.message).toBe('không thể đặt hàng');
            }
        });
    });
});
